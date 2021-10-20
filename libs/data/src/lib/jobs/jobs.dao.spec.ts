import {Pool} from 'pg';
import {TEST_DB_CONNECTION} from '@whosaidtrue/util';
import {cleanDb} from '../util/cleanDb';
import Jobs from "./jobs.dao";
import {Job} from "@whosaidtrue/app-interfaces";

describe('Jobs', () => {
    let pool: Pool;
    let jobs: Jobs;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        jobs = new Jobs(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
    })

    afterAll(() => {
        pool.end();
    })

    describe('insertOne', () => {

        it('should return job details', async () => {
            const now = new Date();

            const actual = (await jobs.insertOne('type', 'data', now)).rows[0];

            expect(actual.id).toBeDefined();
            expect(actual.type).toEqual('type');
            expect(actual.status).toEqual('pending');
            expect(actual.data).toEqual('data');
            expect(actual.started_at).toBeNull();
            expect(actual.completed_at).toBeNull();
            expect(actual.scheduled_at).toEqual(now);
            expect(actual.created_at).toBeDefined();
            expect(actual.updated_at).toBeDefined();
        })


        it('should create job in db', async () => {
            const now = new Date();
            const expected = (await jobs.insertOne('type', 'data', now)).rows[0];

            const actual = (await jobs.getById(expected.id)).rows[0];

            expectJobsEqual(actual, expected);
        })
    })

    describe('pollJob', () => {

        it('should return job details', async () => {
            const expected = (await jobs.insertOne('type', 'data')).rows[0];

            const actual = await jobs.pollJob();
            await actual.abortJob();

            expectJobsEqual(actual, expected);

        })

        it('should return first pending job', async () => {
            const now = new Date();
            await jobs.insertOne('completed', 'data', now, 'completed');
            await jobs.insertOne('failed', 'data', now, 'failed');
            await jobs.insertOne('canceled', 'data', now, 'canceled');
            await jobs.insertOne('pending_1', 'data', now, 'pending');
            await jobs.insertOne('pending_2', 'data', now, 'pending');

            const actual = await jobs.pollJob();
            await actual.abortJob();

            expect(actual.type).toEqual('pending_1');
        })

        it('should return null when no next pending job', async () => {
            const now = new Date();
            await jobs.insertOne('completed', 'data', now, 'completed');
            await jobs.insertOne('failed', 'data', now, 'failed');
            await jobs.insertOne('canceled', 'data', now, 'canceled');

            const actual = await jobs.pollJob();

            expect(actual).toBeNull();

        })

        it('should return first scheduled job', async () => {
            const now = new Date();
            await jobs.insertOne('later', 'data', new Date(now.getTime() + 1), 'pending');
            await jobs.insertOne('sooner', 'data', now, 'pending');

            const actual = await jobs.pollJob();
            await actual.abortJob();

            expect(actual.type).toEqual('sooner');
        })

        it('should be exclusive', async () => {
            await jobs.insertOne('type', 'data');

            const first = await jobs.pollJob();
            const second = await jobs.pollJob();

            expect(first).not.toBeNull();
            expect(second).toBeNull();

            first.abortJob();
        })

        it('should allow concurrency', async () => {
            await jobs.insertOne('first', 'data');
            await jobs.insertOne('second', 'data');

            const first = await jobs.pollJob();
            const second = await jobs.pollJob();

            expect(first.type).toEqual('first');
            expect(second.type).toEqual('second');

            first.abortJob();
            second.abortJob();
        })
    })

    describe('startJob', () => {

        it('should update started_at', async () => {
            const expected = (await jobs.insertOne('type', 'data')).rows[0];

            const job = await jobs.pollJob();
            await job.startJob();
            await job.finishJob();

            const actual = (await jobs.getById(job.id)).rows[0] as Job;
            expect(actual.id).toEqual(expected.id);
            expect(actual.type).toEqual(expected.type);
            expect(actual.data).toEqual(expected.data);
            expect(actual.started_at).not.toBeNull();
            expect(actual.scheduled_at).toEqual(expected.scheduled_at);
        })
    })

    describe('finishJob', () => {

        it('should update status and completed_at', async () => {
            const expected = (await jobs.insertOne('type', 'data')).rows[0];

            const job = await jobs.pollJob();
            await job.finishJob('failed');

            const actual = (await jobs.getById(job.id)).rows[0] as Job;
            expect(actual.id).toEqual(expected.id);
            expect(actual.type).toEqual(expected.type);
            expect(actual.status).toEqual('failed');
            expect(actual.data).toEqual(expected.data);
            expect(actual.started_at).toBeNull();
            expect(actual.completed_at).not.toBeNull();
            expect(actual.scheduled_at).toEqual(expected.scheduled_at);
        })
    })

    describe('abortJob', () => {

        it('should not change job details', async () => {
            const expected = (await jobs.insertOne('type', 'data')).rows[0];

            const job = await jobs.pollJob();
            job.startJob();
            job.abortJob();

            const actual = (await jobs.getById(job.id)).rows[0];
            expectJobsEqual(actual, expected);
        })
    })

    describe('listen/notify', () => {

        it('should notify on insert', async () => {
            const client = await jobs.pool.connect();
            try {
                const messages = [];
                client.on('notification', (msg) => messages.push(msg));
                await client.query('LISTEN jobs');

                await jobs.insertOne('type', 'data');
                await jobs.insertOne('type', 'data');

                await delay(100);
                expect(messages.length).toEqual(2);
            } finally {
                client.release();
            }
        })

        it('should only notify pending tasks', async () => {
            const client = await jobs.pool.connect();
            try {
                const messages = [];
                client.on('notification', (msg) => messages.push(msg));
                await client.query('LISTEN jobs');

                const now = new Date();
                await jobs.insertOne('completed', 'data', now, 'completed');
                await jobs.insertOne('failed', 'data', now, 'failed');
                await jobs.insertOne('canceled', 'data', now, 'canceled');

                await delay(100);
                expect(messages.length).toEqual(0);
            } finally {
                client.release();
            }
        })

        it('should notify on reschedule', async () => {
            const client = await jobs.pool.connect();
            try {
                const messages = [];
                client.on('notification', (msg) => messages.push(msg));
                await client.query('LISTEN jobs');

                const job = (await jobs.insertOne('type', 'data')).rows[0];
                await jobs.rescheduleJob(job.id, new Date(Date.now() + 1000));

                await delay(100);
                expect(messages.length).toEqual(2);
            } finally {
                client.release();
            }
        })

        it('should not notify on reschedule if completed', async () => {
            const client = await jobs.pool.connect();
            try {
                const messages = [];
                client.on('notification', (msg) => messages.push(msg));
                await client.query('LISTEN jobs');

                const job = (await jobs.insertOne('type', 'data', new Date(), 'completed')).rows[0];
                await jobs.rescheduleJob(job.id, new Date(Date.now() + 1000));

                await delay(100);
                expect(messages.length).toEqual(0);
            } finally {
                client.release();
            }
        })

        it('should not notify throughout job lifecycle', async () => {
            const client = await jobs.pool.connect();
            try {
                await jobs.insertOne('type', 'data');
                await jobs.insertOne('type', 'data');

                const messages = [];
                client.on('notification', (msg) => messages.push(msg));
                await client.query('LISTEN jobs');

                // scenario 1: abort
                const s1 = await jobs.pollJob();
                await s1.abortJob();

                // scenario 2: success
                const s2 = await jobs.pollJob();
                await s2.startJob();
                await s2.finishJob('completed');

                // scenario 3: fail
                const s3 = await jobs.pollJob();
                await s3.startJob();
                await s3.finishJob('failed');

                await delay(100);
                expect(messages.length).toEqual(0);
            } finally {
                client.release();
            }
        })
    })

})

function expectJobsEqual(actual: Job, expected: Job) {
    expect(actual.id).toEqual(expected.id);
    expect(actual.type).toEqual(expected.type);
    expect(actual.status).toEqual(expected.status);
    expect(actual.data).toEqual(expected.data);
    expect(actual.started_at).toBeNull();
    expect(actual.completed_at).toBeNull();
    expect(actual.scheduled_at).toEqual(expected.scheduled_at);
    expect(actual.created_at).toEqual(expected.created_at);
    expect(actual.updated_at).toEqual(expected.updated_at);
}

async function delay(ms: number) {
    await new Promise((r) => setTimeout(r, ms));
}
