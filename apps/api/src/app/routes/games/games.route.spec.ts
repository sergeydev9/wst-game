import supertest from 'supertest';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';
import App from '../../App';
import { games } from '../../db';
import { signUserPayload } from '@whosaidtrue/middleware';
import { QueryResult } from 'pg';
import { Deck } from '@whosaidtrue/app-interfaces';

const mockedGames = mocked(games);

jest.mock('../../db');

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
                .set('Authorization', `Bearer `)
                .send({ deckId: 123 })
                .expect(401, done)
        })

        it('should return 500 if db throws', (done) => {
            mockedGames.create.mockRejectedValue(new Error('something'))
            supertest(app)
                .post('/games/create')
                .send({ deckId: 123 })
                .set('Authorization', `Bearer ${validToken}`)
                .set('Accept', 'application/json')
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
            mockedGames.create.mockResolvedValue({ rows: [{ id: 1, access_code: 'ABCD' }] } as QueryResult)
            const actual = await supertest(app)
                .post('/games/create')
                .send({ deckId: 123 })
                .set('Authorization', `Bearer ${validToken}`)
                .expect(201)

            const { game_id, access_code } = actual.body;

            expect(game_id).toEqual(1)
            expect(access_code).toEqual('ABCD')

        })
    })

    describe('[GET] /status', () => {

        it('should respond with 422 if there is no access_code in query', done => {
            supertest(app)
                .get('/games/status')
                .expect(422, done)
        })

        it('should respond with 422 if query is less than 4 characters', done => {
            supertest(app)
                .get('/games/status?access_code=ABC')
                .expect(422, done)
        })

        it('should respond with 422 if query is more than 4 characters', done => {
            supertest(app)
                .get('/games/status?access_code=ABCDE')
                .expect(422, done)
        })


        it('should respond with 404 if response from db is empty', done => {
            mockedGames.gameStatusByAccessCode.mockResolvedValue({ rows: [] } as QueryResult)
            supertest(app)
                .get('/games/status?access_code=ABCD')
                .expect(404, done)
        })

        it('should resond with 500 if db throws', done => {
            mockedGames.gameStatusByAccessCode.mockRejectedValue(new Error())
            supertest(app)
                .get('/games/status?access_code=ABCD')
                .expect(500, done)
        })

        it('should respond with 200 and status value if response from db has something', async () => {
            mockedGames.gameStatusByAccessCode.mockResolvedValue({ rows: [{ status: 'test123' }] } as QueryResult)
            const { body } = await supertest(app)
                .get('/games/status?access_code=ABCD')
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
                .send({ access_code: 'ABCD' })
                .expect(422, done)
        })

        it('should respond with 404 if game not found', done => {
            mockedGames.join.mockRejectedValue(new Error('Game not found'))
            supertest(app)
                .post('/games/join')
                .send({ access_code: 'ABCD', name: 'name' })
                .expect(404, done)
        })

        it('should respond with 500 if db throws', done => {
            mockedGames.join.mockRejectedValue({})
            supertest(app)
                .post('/games/join')
                .send({ access_code: 'ABCD', name: 'name' })
                .expect(500, done)
        })

        it('should respond with 201 if success', done => {
            mockedGames.join.mockResolvedValue({
                playerId: 1,
                playerName: 'name',
                gameId: 2,
                access_code: 'ABCD',
                totalQuestions: 9,
                deck: {} as Deck,
                status: 'lobby',
                isHost: false,
                hostName: 'hostname',
                currentQuestionIndex: 1
            })

            supertest(app)
                .post('/games/join')
                .send({ access_code: 'ABCD', name: 'name' })
                .expect('Content-Type', /json/)
                .expect(201, done)
        })

        it('should respond with 403 if status = finished', done => {
            mockedGames.join.mockResolvedValue({
                playerId: 1,
                playerName: 'name',
                gameId: 2,
                access_code: 'ABCD',
                totalQuestions: 9,
                deck: {} as Deck,
                status: 'finished',
                isHost: false,
                hostName: 'hostname',
                currentQuestionIndex: 1
            })

            supertest(app)
                .post('/games/join')
                .send({ access_code: 'ABCD', name: 'name' })
                .expect(403, done)
        })
    })

    describe('[PATCH] /end', () => {

        it('should return 204 if success', done => {

            mockedGames.endGameIfHost.mockResolvedValue({ rowCount: 1 } as QueryResult);
            supertest(app)
                .patch('/games/end')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ gameId: 1523 })
                .expect(204, done)
        })

        it('should return 400 if no rows affected', done => {

            mockedGames.endGameIfHost.mockResolvedValue({ rowCount: 0 } as QueryResult);
            supertest(app)
                .patch('/games/end')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ gameId: 1523 })
                .expect(400, done)
        })

        it('should return 500 if query throws', done => {

            mockedGames.endGameIfHost.mockRejectedValue(new Error());
            supertest(app)
                .patch('/games/end')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ gameId: 1523 })
                .expect(500, done)
        })

        it('should return 401 if no valid token', done => {

            mockedGames.endGameIfHost.mockRejectedValue(new Error());
            supertest(app)
                .patch('/games/end')
                .send({ gameId: 1523 })
                .expect(401, done)
        })
    })
})