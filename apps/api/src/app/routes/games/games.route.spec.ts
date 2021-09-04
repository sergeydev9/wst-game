import supertest from 'supertest';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';

import App from '../../App';
import { games } from '../../db';
import { signUserPayload } from '@whosaidtrue/middleware';
import { QueryResult } from 'pg';

jest.mock('../../db');

const mockedGames = mocked(games, true);

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
})