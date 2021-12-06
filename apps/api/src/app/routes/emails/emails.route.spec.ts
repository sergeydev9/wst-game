import supertest from 'supertest';
import { QueryResult } from 'pg';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';
import App from '../../App';
import { signUserPayload } from '@whosaidtrue/middleware';

import { emails } from '../../db';

jest.mock('../../db');
const mockedEmails = mocked(emails, true);

describe('emails route', () => {
    let app: Application;
    let validToken: string;

    beforeAll(() => {
        app = new App().app;
        validToken = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] });
    })

    describe('POST /', () => {

        it('should return 201 if all required data is present', (done) => {

            supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    email: 'test@test.com',
                    category: 'BUG REPORT',
                    name: 'test',
                    message: 'this is a test'
                })
                .expect(201, done)
        })

        it('should have been called with user_id if there was a valid token', async () => {

            mockedEmails.enqueue.mockResolvedValue({ rows: [1] } as QueryResult);
            await supertest(app)
                .post('/emails')
                .set('Authorization', `Bearer ${validToken}`)
                .set('origin', 'www.test.com')
                .send({
                    email: 'test@test.com',
                    category: 'BUG REPORT',
                    name: 'test',
                    message: 'this is a test'
                })
                .expect(201)

            expect(mockedEmails.enqueue).toHaveBeenCalledWith({
                user_id: 1,
                to: process.env.EMAIL_RECIPIENT,
                subject: `[BUG REPORT] - Sent by test - test@test.com from www.test.com`,
                text: 'this is a test'
            })
        })

        it('should have been called without user_id if there was no token', async () => {

            mockedEmails.enqueue.mockResolvedValue({ rows: [1] } as QueryResult);
            await supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    email: 'test@test.com',
                    category: 'BUG REPORT',
                    name: 'test',
                    message: 'this is a test'
                })
                .expect(201)

            expect(mockedEmails.enqueue).toHaveBeenCalledWith({
                user_id: undefined,
                to: process.env.EMAIL_RECIPIENT,
                subject: `[BUG REPORT] - Sent by test - test@test.com from www.test.com`,
                text: 'this is a test'
            })
        })

        it('should fail if no email', done => {
            supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    category: 'BUG REPORT',
                    name: 'test',
                    message: 'this is a test'
                })
                .expect(422, done)
        })

        it('should fail if email invalid', done => {
            supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    email: 'test.com',
                    category: 'BUG REPORT',
                    name: 'test',
                    message: 'this is a test'
                })
                .expect(422, done)
        })


        it('should fail if no category', done => {
            supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    email: 'test@test.com',
                    name: 'test',
                    message: 'this is a test'
                })
                .expect(422, done)
        })




        it('should fail if category too long', done => {
            let category = '';

            let count = 0;
            while (count <= 200) {
                category += 's';
                count++
            }

            supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    email: 'test@test.com',
                    category,
                    name: 'test',
                    message: 'this is a test'
                })
                .expect(422, done)
        })


        it('should fail if no name', done => {
            supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    email: 'test@test.com',
                    category: 'BUG REPORT',
                    message: 'this is a test'
                })
                .expect(422, done)
        })

        it('should fail if name is too long', done => {
            let name = '';

            let count = 0;
            while (count <= 500) {
                name += 's';
                count++
            }
            supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    name,
                    email: 'test@test.com',
                    category: 'BUG REPORT',
                    message: 'this is a test'
                })
                .expect(422, done)
        })

        it('should fail if no message', done => {
            supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    email: 'test@test.com',
                    category: 'BUG REPORT',
                    name: 'test',
                })
                .expect(422, done)
        })

        it('should fail if message is too long', done => {

            let message = '';
            let count = 0;

            while (count <= 500) {
                message += 's';
                count++
            }

            supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    email: 'test@test.com',
                    category: 'BUG REPORT',
                    name: 'test',
                    message
                })
                .expect(422, done)
        })

        it('should escape dangerous user input in message', async () => {
            mockedEmails.enqueue.mockResolvedValue({ rows: [1] } as QueryResult);

            await supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    email: 'test@test.com',
                    category: 'BUG REPORT',
                    name: 'test',
                    message: 'this is a test<script>alert("you have been hacked");</script>'
                })
                .expect(201)

            expect(mockedEmails.enqueue).toHaveBeenCalledWith({
                user_id: undefined,
                to: process.env.EMAIL_RECIPIENT,
                subject: `[BUG REPORT] - Sent by test - test@test.com from www.test.com`,
                text: 'this is a test&lt;script&gt;alert(&quot;you have been hacked&quot;);&lt;&#x2F;script&gt;'
            })
        })

        it('should escape dangerous user input in name', async () => {
            mockedEmails.enqueue.mockResolvedValue({ rows: [1] } as QueryResult);

            await supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    email: 'test@test.com',
                    category: 'BUG REPORT',
                    name: 'test<script>alert("you have been hacked");</script>',
                    message: 'this is a test'
                })
                .expect(201)

            expect(mockedEmails.enqueue).toHaveBeenCalledWith({
                user_id: undefined,
                to: process.env.EMAIL_RECIPIENT,
                subject: `[BUG REPORT] - Sent by test&lt;script&gt;alert(&quot;you have been hacked&quot;);&lt;&#x2F;script&gt; - test@test.com from www.test.com`,
                text: 'this is a test'
            })
        })


        // DEV_NOTE: Normally, the user doesn't set the category. They choose it from a dropdown.
        // However, it doesn't hurt to escape that value anyways in case
        // someone has the idea to try and send malicious input by calling the API directly.
        it('should escape dangerous user input in category', async () => {
            mockedEmails.enqueue.mockResolvedValue({ rows: [1] } as QueryResult);

            await supertest(app)
                .post('/emails')
                .set('origin', 'www.test.com')
                .send({
                    email: 'test@test.com',
                    category: 'BUG REPORT<script>alert("you have been hacked");</script>',
                    name: 'test',
                    message: 'this is a test'
                })
                .expect(201)

            expect(mockedEmails.enqueue).toHaveBeenCalledWith({
                user_id: undefined,
                to: process.env.EMAIL_RECIPIENT,
                subject: `[BUG REPORT&lt;script&gt;alert(&quot;you have been hacked&quot;);&lt;&#x2F;script&gt;] - Sent by test - test@test.com from www.test.com`,
                text: 'this is a test'
            })
        })
    })
})
