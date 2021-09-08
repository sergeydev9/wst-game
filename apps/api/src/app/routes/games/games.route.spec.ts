import supertest from 'supertest';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';

import App from '../../App';
import jwt from 'jsonwebtoken';
import { games } from '../../db';
import { signUserPayload, signGameToken } from '@whosaidtrue/middleware';
import { QueryResult } from 'pg';
import { Deck } from '@whosaidtrue/app-interfaces';

jest.mock('../../db');
jest.mock('jsonwebtoken')

const mockedGames = mocked(games, true);
const mockedJwt = mocked(jwt, true);


describe('games routes', () => {
    let app: Application;
    let validToken: string;

    beforeAll(() => {
        app = new App().app;
        validToken = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('[POST] /create', () => {
        it('should return 422 if there was no deckId', (done) => {
            supertest(app)
                .post('/games/create')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(422, done)
        })

        it('should return 401 if there was no token', (done) => {
            supertest(app)
                .post('/games/create')
                .send({ deckId: 123 })
                .expect(401, done)
        })

        it('should return 500 if db throws', (done) => {
            mockedGames.create.mockRejectedValue(new Error('something'))
            supertest(app)
                .post('/games/create')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ deckId: 123 })
                .expect(500, done)
        })

        it('should return 500 if db returns empty response', (done) => {
            mockedGames.create.mockResolvedValue({ rows: [] } as QueryResult)
            supertest(app)
                .post('/games/create')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ deckId: 123 })
                .expect(500, done)
        })

        it('should respond with 201 if db sends result back', async () => {
            mockedGames.create.mockResolvedValue({ rows: [{ id: 1, access_code: '123456' }] } as QueryResult)
            const actual = await supertest(app)
                .post('/games/create')
                .set('Authorization', `Bearer ${validToken}`)

                .set('Accept', 'application/json')
                .send({ deckId: 123 })
                .expect('Content-Type', /json/)
                .expect(201)
            const { game_id, access_code } = actual.body;

            expect(game_id).toEqual(1)
            expect(access_code).toEqual('123456')

        })
    })

    describe('[GET] /status', () => {

        it('should respond with 422 if there is no access_code in query', done => {
            supertest(app)
                .get('/games/status')
                .expect(422, done)
        })

        it('should respond with 422 if query is less than 6 characters', done => {
            supertest(app)
                .get('/games/status?access_code=12345')
                .expect(422, done)
        })

        it('should respond with 422 if query is more than 6 characters', done => {
            supertest(app)
                .get('/games/status?access_code=1234567')
                .expect(422, done)
        })


        it('should respond with 404 if response from db is empty', done => {
            mockedGames.getByAccessCode.mockResolvedValue({ rows: [] } as QueryResult)
            supertest(app)
                .get('/games/status?access_code=123456')
                .expect(404, done)
        })

        it('should resond with 500 if db throws', done => {
            mockedGames.getByAccessCode.mockRejectedValue(new Error())
            supertest(app)
                .get('/games/status?access_code=123456')
                .expect(500, done)
        })

        it('should respond with 200 and status value if response from db has something', async () => {
            mockedGames.getByAccessCode.mockResolvedValue({ rows: [{ status: 'test123' }] } as QueryResult)
            const { body } = await supertest(app)
                .get('/games/status?access_code=123456')
                .expect(200)

            expect(body.status).toEqual('test123')
        })
    })

    describe('[POST] /join', () => {

        it('should return 422 if no access_code', done => {
            supertest(app)
                .post('/games/join')
                .send({ name: 'name' })
                .expect(422, done)
        })

        it('should return 422 if no name', done => {
            supertest(app)
                .post('/games/join')
                .send({ access_code: '123abb' })
                .expect(422, done)
        })

        it('should respond with 404 if game not found', done => {
            mockedGames.join.mockRejectedValue(new Error('Game not found'))
            supertest(app)
                .post('/games/join')
                .send({ access_code: '123abb', name: 'name' })
                .expect(404, done)
        })

        it('should respond with 500 if db throws', done => {
            mockedGames.join.mockRejectedValue({})
            supertest(app)
                .post('/games/join')
                .send({ access_code: '123abb', name: 'name' })
                .expect(500, done)
        })

        it('should respond with 201 if success', done => {
            mockedGames.join.mockResolvedValue({
                playerId: 1,
                playerName: 'name',
                players: [],
                gameId: 2,
                access_code: '12345',
                totalQuestions: 9,
                deck: {} as Deck,
                status: 'finished',
                isHost: false,
                currentHostName: 'hostname',
                currentQuestionIndex: 1
            })

            supertest(app)
                .post('/games/join')
                .send({ access_code: '123abb', name: 'name' })
                .expect('Content-Type', /json/)
                .expect(201, done)
        })
    })
})