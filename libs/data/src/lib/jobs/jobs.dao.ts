import {Pool, PoolClient, QueryResult} from 'pg';
import Dao from '../base.dao';
import {Job, JobStatus, JobTransaction} from "@whosaidtrue/app-interfaces";

class Jobs extends Dao {
    constructor(pool: Pool) {
        super(pool, 'jobs')
    }

    public insertOne(type: string, scheduledAt = new Date(), status: JobStatus = 'pending'): Promise<QueryResult<Job>> {
        const query = {
            text: `INSERT INTO jobs (type, scheduled_at, status)
                   VALUES ($1, $2, $3) RETURNING *`,
            values: [type, scheduledAt, status]
        };

        return this.pool.query(query);
    }

    public rescheduleJob(jobId: number, scheduledAt = new Date()): Promise<QueryResult<Job>> {
        const query = {
            text: `UPDATE jobs SET scheduled_at = $1 WHERE id = $2 RETURNING *`,
            values: [scheduledAt, jobId]
        };

        return this.pool.query(query);
    }

    public cancelJob(jobId): Promise<QueryResult<Job>> {
        const query = {
            text: `UPDATE jobs SET status = 'canceled', canceled_at = NOW() WHERE id = $1 AND status = 'pending' RETURNING *`,
            values: [jobId]
        };

        return this.pool.query(query);
    }

    /**
     * Query the next job to execute. The returned job must call finishJob() or abortJob() to end the transaction.
     *
     * {code}
     * const job = jobs.pollJob();
     * if (job) {
     *     try {
     *         job.startJob();
     *         // do work
     *         job.finishJob(); // or job.abortJob()
     *     } catch(e) {
     *         job.finishJob('failed');
     *     }
     * }
     * {code}
     *
     * This method is safe to call from multiple threads / processes.
     *
     * @return JobTransaction or null
     */
    public async pollJob(): Promise<JobTransaction | null> {
        const query = `
            SELECT * FROM jobs WHERE status = 'pending' ORDER BY scheduled_at
            FOR UPDATE SKIP LOCKED
            LIMIT 1`;

        const client = await this.client;
        await client.query('BEGIN');

        const job = (await client.query(query)).rows[0] as Job;
        if (!job) {
            await this.rollbackJob(client);
            return null;
        }

        return {
            ...job,
            startJob: () => this.startJob(job, client),
            finishJob: (status: JobStatus = 'completed', result: string = null) => this.finishJob(job, status, result, client),
            abortJob: () => this.rollbackJob(client)
        };
    }

    private async startJob(job: Job, client: PoolClient) {
        const query = {
            text: `UPDATE jobs SET started_at = NOW() WHERE id = $1`,
            values: [job.id]
        };
        return client.query(query);
    }

    private async finishJob(job: Job, status: JobStatus, result: string, client: PoolClient) {
        const query = {
            text:`UPDATE jobs SET status = $1, result = $2, completed_at = NOW() WHERE id = $3`,
            values: [status, result, job.id]
        };

        try {
            const result = await client.query(query);
            await client.query('COMMIT');
            return result;
        } finally {
            client.release();
        }
    }

    private async rollbackJob(client: PoolClient) {
        try {
            return client.query('ROLLBACK');
        } finally {
            client.release();
        }
    }
}

export default Jobs