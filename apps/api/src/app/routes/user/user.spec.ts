import supertest from 'supertest';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';
import App from '../../App';
import { users } from '../../db';
import { QueryResult } from 'pg';

const mockedUsers = mocked(users, true)
jest.mock('../../db')

describe('user', () => {
    let app: Application;

    beforeAll(() => {
        app = new App().app;
    })

    beforeEach(() => {
        jest.clearAllMocks();

    })

    describe('[POST] /login', () => {

        it('should return 200 and a token if login call has result in rows', async () => {
            // set mock value
            mockedUsers.login.mockResolvedValue({ rows: [{ id: 1, email: 'email@email.com' }] } as QueryResult)

            const { body } = await supertest(app)
                .post('/login')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)

            // response should have token attribute
            expect(body.token).toBeDefined()
            expect(typeof body.token).toEqual('string')
        })

        it('should return 401 if result is empty array', (done) => {
            // set mock value
            mockedUsers.login.mockResolvedValue({ rows: [] } as QueryResult)
            supertest(app)
                .post('/login')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect(401, done)

        })

        it('should return 500 if login request rejects (unknwon error e.g. cannot connect to db)', (done) => {
            // set mock value
            mockedUsers.login.mockRejectedValue('error')

            supertest(app)
                .post('/login')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect(500, done)
        })

        it('should return 422 if email invalid', async () => {
            const { body } = await supertest(app)
                .post('/login')
                .send({ email: 'email', password: 'password123' })
                .set('Accept', 'application/json')
                .expect(422)

            expect(body[0].param).toEqual('email');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })

        it('should return 422 if password less than 8 characters', async () => {
            const { body } = await supertest(app)
                .post('/login')
                .send({ email: 'email@test.com', password: 'pad123' })
                .set('Accept', 'application/json')
                .expect(422)

            expect(body[0].param).toEqual('password');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })

        it('should return 422 if password has no numbers', async () => {
            const { body } = await supertest(app)
                .post('/login')
                .send({ email: 'email@test.com', password: 'password' })
                .set('Accept', 'application/json')
                .expect(422)

            expect(body[0].param).toEqual('password');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })


    })

})