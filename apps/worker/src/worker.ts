import {pool, jobs} from './db'
import {Notification, PoolClient} from "pg";
import {logError, logger} from '@whosaidtrue/logger';
import {createTask} from "./task";

class Worker {
    private readonly POLL_MAX_MS = 60 * 1000; // 1 min

    private notifyClient: PoolClient | null;
    private nextTime = Infinity;
    private nextTimeout: NodeJS.Timeout | null;
    private exponentialBackoff = 0;

    public async start() {
        logger.trace("start()");

        this.notifyClient = await pool.connect();

        this.notifyClient.on('notification', (message: Notification) => {
            logger.debug(message, "message");

            let time = Date.now();
            if (message.payload) {
                try {
                    const job = JSON.parse(message.payload);
                    time = new Date(job.scheduled_at).getTime();
                } catch (e) {
                    logError('JSON.parse error', e);
                }
            }
            this.scheduleNextPoll(time);
        });

        await this.notifyClient.query("LISTEN jobs");
        logger.info(`=================================`);
        logger.info(`======= ENV: ${process.env.NODE_ENV} =========`);
        logger.info(`🚀 Worker listening on table jobs`);
        logger.info(`=================================`);

        this.scheduleNextPoll();
    };

    private async attemptNextJob() {
        logger.trace("attemptNextJob()");

        let status = 'empty';
        let scheduledAt: number;

        // query next job
        const job = await jobs.pollJob();

        // have job?
        if (job) {

            // can execute?
            if (job.scheduled_at.getTime() <= Date.now()) {

                try {
                    logger.info(`Execute job=${job.id}, type=${job.type}, start`);
                    await job.startJob();

                    const result = await createTask(job).execute();
                    // TODO: add retries?

                    // finish job
                    const stringResult = (typeof result.result === 'string') ? result.result : JSON.stringify(result.result);
                    await job.finishJob(result.status, stringResult);
                    logger.info(`Execute job=${job.id}, type=${job.type}, status=${result.status}`);
                    status = 'done';
                } catch (e) {
                    logError(`executing job failed ${job.id}, ${job.type}`, e);
                    await job.finishJob('failed', JSON.stringify(e));
                    status = 'done';
                }

            } else {
                logger.info(`Execute job=${job.id}, type=${job.type}, aborting - scheduled at: ${job.scheduled_at}`);
                await job.abortJob();
                status = 'scheduled';
                scheduledAt = job.scheduled_at.getTime();
            }
        }


        switch (status) {

            case 'done':
                this.exponentialBackoff = 0;
                this.scheduleNextPoll();
                break;

            case 'scheduled':
                this.exponentialBackoff = 0;
                this.scheduleNextPoll(scheduledAt);
                break;

            case 'empty': {
                this.exponentialBackoff++;
                const timeout = Math.min(50 * 2 ** this.exponentialBackoff, this.POLL_MAX_MS);
                this.scheduleNextPoll(Date.now() + timeout);
            }
                break;
            default:
                logger.error(`Unhandled status ${status}`);
                break;

        }
    }

    private scheduleNextPoll(pollTime = Date.now()) {
        logger.trace(`scheduleNextPoll(): ${pollTime}`);

        // ignore requests later than the next scheduled poll
        if (this.nextTimeout && pollTime >= this.nextTime) {
            logger.debug(`abort scheduleNextPoll(): ${pollTime}`);
            return;
        }

        // calculate requested timeout clamping to [0, POLL_MAX]
        const timeout = Math.min(Math.max(pollTime - Date.now(), 0), this.POLL_MAX_MS);

        // cancel existing timeout
        if (this.nextTimeout) {
            clearTimeout(this.nextTimeout);
            this.nextTimeout = null;
        }

        // schedule the next one
        logger.info(`next poll in ${timeout} ms`);
        this.nextTimeout = setTimeout(() => {
            this.attemptNextJob();
        }, timeout)
    }

    public stop() {
        this.notifyClient?.release();
        this.notifyClient = null;
    }
}

export default Worker;