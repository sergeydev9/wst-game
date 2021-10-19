import {pool} from './db'
import {Notification, PoolClient} from "pg";
import { logger } from '@whosaidtrue/logger';

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
                    logger.error(e);
                }
            }
            this.scheduleNextPoll(time);
        });

        await this.notifyClient.query("LISTEN jobs");
        logger.info("LISTEN jobs");

        this.scheduleNextPoll();
    };

    private async attemptNextJob() {
        logger.trace("attemptNextJob()");

        const client = await pool.connect();
        let status = 'empty';
        let scheduledAt: number;

        try {
            // start transaction
            let commit = false;
            await client.query('BEGIN');

            // query next job
            const { rows } = await client.query(`
                SELECT * FROM jobs WHERE status = 'pending' ORDER BY scheduled_at 
                FOR UPDATE SKIP LOCKED 
                LIMIT 1`);
            const job = rows[0];

            // have job?
            if (job) {
                status = 'pending';
                scheduledAt = new Date(job.scheduled_at).getTime();

                // can execute?
                if (scheduledAt <= Date.now()) {
                    logger.info(`executing job ${job.id}, ${job.type}`);
                    await client.query(`UPDATE jobs SET started_at = NOW() WHERE id = ${job.id}`);

                    try {
                        // TODO: run worker task
                        await client.query(`UPDATE jobs SET status = 'completed', completed_at = NOW() WHERE id = ${job.id}`);
                        status = 'completed';
                    } catch (e) {
                        // TODO: add retries
                        await client.query(`UPDATE jobs SET status = 'failed', completed_at = NOW() WHERE id = ${job.id}`);
                        status = 'failed';
                    }
                    commit = true;
                }
            }

            await client.query(commit ? 'COMMIT' : 'ROLLBACK');
        } catch (e) {
            logger.error('attemptNextJob() failed', e);
            await client.query('ROLLBACK');
            status = 'error';
        } finally {
            client.release()
        }

        switch (status) {

            case 'completed':
            case 'failed':
                this.exponentialBackoff = 0;
                this.scheduleNextPoll();
                break;

            case 'pending':
                this.exponentialBackoff = 0;
                this.scheduleNextPoll(scheduledAt);
                break;

            case 'empty':
            case 'error': {
                this.exponentialBackoff++;
                const timeout = Math.min(50 * 2 ** this.exponentialBackoff, this.POLL_MAX_MS);
                this.scheduleNextPoll(Date.now() + timeout);
            } break;
            default:
                logger.error(`Unhandled status ${status}`);
                break;

        }
    }

    private scheduleNextPoll(pollTime = Date.now()) {
        logger.trace("scheduleNextPoll()", pollTime);

        // ignore requests later than the next scheduled poll
        if (this.nextTimeout && pollTime >= this.nextTime) {
            logger.debug("abort scheduleNextPoll()", pollTime);
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