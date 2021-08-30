import supertest from 'supertest';
import { QueryResult, DatabaseError } from 'pg';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';
import jwt from 'jsonwebtoken';
import validator from 'validator';

// local
import App from '../../App';
import { users } from '../../db';
import { signUserPayload } from '@whosaidtrue/middleware';

const mockedUsers = mocked(users, true)
jest.mock('../../db')

describe('/user routes', () => {
    let app: Application;

    beforeAll(() => {
        app = new App().app;
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('[POST] /login', () => {

        it('should return 201 and a token if login call has result in rows', async () => {
            // set mock value
            mockedUsers.login.mockResolvedValue({ rows: [{ id: 1, email: 'email@email.com', roles: ["user"], notifications: false }] } as QueryResult)

            const { body } = await supertest(app)
                .post('/user/login')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)

            // response should be a valid JWT token
            expect(validator.isJWT(body.token)).toEqual(true)

            // JWT token payload has expected attributes
            const { user } = jwt.decode(body.token, { json: true })
            expect(user.id).toEqual(1)
            expect(user.email).toEqual('email@email.com')
            expect(user.roles).toEqual(["user"])
        })

        it('should return 401 if result is empty array', (done) => {
            // set mock value
            mockedUsers.login.mockResolvedValue({ rows: [] } as QueryResult)
            supertest(app)
                .post('/user/login')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect(401, done)

        })

        it('should return 500 if login request rejects due to unknown error (e.g. cannot connect to db)', (done) => {
            // set mock value
            mockedUsers.login.mockRejectedValue('error')

            supertest(app)
                .post('/user/login')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect(500, done)
        })

        it('should return 422 if email invalid', async () => {
            const { body } = await supertest(app)
                .post('/user/login')
                .send({ email: 'email', password: 'password123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('email');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })

        it('should return 422 if password less than 8 characters', async () => {
            const { body } = await supertest(app)
                .post('/user/login')
                .send({ email: 'email@test.com', password: 'pad123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('password');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })

        it('should return 422 if password has no numbers', async () => {
            const { body } = await supertest(app)
                .post('/user/login')
                .send({ email: 'email@test.com', password: 'password' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('password');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })
    })

    describe('[POST] /register', () => {

        it('should return 201 and a token payload if db response has content', async () => {
            // set mock value
            mockedUsers.register.mockResolvedValue({ rows: [{ id: 1, email: 'email@email.com', roles: ["user"], notifications: false }] } as QueryResult)

            const { body } = await supertest(app)
                .post('/user/register')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)

            // response should be a valid JWT token
            expect(validator.isJWT(body.token)).toEqual(true)

            // JWT token payload has expected attributes
            const { user } = jwt.decode(body.token, { json: true })
            expect(user.id).toEqual(1)
            expect(user.email).toEqual('email@email.com')
            expect(user.roles).toEqual(["user"])
        })

        it('should return 422 if an account already exists for that email', (done) => {
            // set mock value
            mockedUsers.register.mockRejectedValue(new DatabaseError("duplicate key value violates unique constraint \"users_email_key\"", 1, "error"))

            supertest(app)
                .post('/user/register')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect(422, done)
        })


        it('should return 500 if login request rejects due to unknown error (e.g. cannot connect to db)', (done) => {
            // set mock value
            mockedUsers.register.mockRejectedValue('error')

            supertest(app)
                .post('/user/register')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect(500, done)
        })

        it('should return 422 if email invalid', async () => {
            const { body } = await supertest(app)
                .post('/user/register')
                .send({ email: 'email', password: 'password123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('email');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })

        it('should return 422 if password less than 8 characters', async () => {
            const { body } = await supertest(app)
                .post('/user/register')
                .send({ email: 'email@test.com', password: 'pad123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('password');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })

        it('should return 422 if password has no numbers', async () => {
            const { body } = await supertest(app)
                .post('/user/register')
                .send({ email: 'email@test.com', password: 'password' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('password');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })
    })

    describe('[PATCH] /send-reset', () => {
        it('should return 422 if email is not valid', async () => {
            const { body } = await supertest(app)
                .patch('/user/send-reset')
                .send({ email: 'email' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('email');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })
    })

    describe('[DELETE] /delete', () => {

        it('should return 204 if successful', (done) => {
            mockedUsers.deleteById.mockResolvedValue({ rows: [{ count: 1 }] } as QueryResult)
            const token = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
            supertest(app)
                .delete('/user/delete')
                .set('Authorization', `Bearer ${token}`)
                .expect(204, done)
        })

        it('should return 500 if count is 0', (done) => {
            mockedUsers.deleteById.mockResolvedValue({ rows: [{ count: 0 }] } as QueryResult)
            const token = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
            supertest(app)
                .delete('/user/delete')
                .set('Authorization', `Bearer ${token}`)
                .expect(500, done)
        })

        it('should return 500 if DB request throws', (done) => {
            mockedUsers.deleteById.mockRejectedValue('error')
            const token = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
            supertest(app)
                .delete('/user/delete')
                .set('Authorization', `Bearer ${token}`)
                .expect(500, done)
        })

        it('should return 401 if no auth header is set', (done) => {
            supertest(app)
                .delete('/user/delete')
                .expect(401, done)
        })

        it('should return 401 if auth token is invalid', (done) => {
            const token = jwt.sign('test', 'bad token')
            supertest(app)
                .delete('/user/delete')
                .set('Authorization', `Bearer ${token}`)
                .expect(401, done)
        })
    })

    describe('[GET] /details', () => {

        it('should return 200 if successful', async () => {
            mockedUsers.getDetails.mockResolvedValue({ rows: [{ id: 1, email: 'email@email.com', notifications: false, question_deck_credits: 1, roles: ['user'] }] } as QueryResult)
            const token = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
            const response = await supertest(app)
                .get('/user/details')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200)

            const { id, email, notifications, question_deck_credits, roles } = response.body;

            expect(id).toBeDefined();
            expect(email).toEqual(email);
            expect(notifications).toBeDefined();
            expect(roles.length).toBeGreaterThan(0);
            expect(question_deck_credits).toBeDefined();

        })
    })

})