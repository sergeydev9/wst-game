import supertest from 'supertest';
import { QueryResult, } from 'pg';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';
import jwt from 'jsonwebtoken';

// local
import App from '../../App';
import { decks } from '../../db';
import { signUserPayload } from '@whosaidtrue/middleware';

const mockedDecks = mocked(decks, true)
jest.mock('../../db')


describe('/decks routes', () => {
    let app: Application;

    beforeAll(() => {
        app = new App().app;
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('[GET] /decks?id=', () => {

    })

    describe('[GET] /selection', () => {

        it('should get user decks if there is a valid token in header', async () => {
            mockedDecks.getUserDecks.mockResolvedValue({ rows: [] } as QueryResult)
            mockedDecks.userDeckSelection.mockResolvedValue({ rows: [] } as QueryResult)

            // create valid token
            const token = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
            await supertest(app)
                .get('/decks/selection')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(mockedDecks.getUserDecks).toBeCalled();
            expect(mockedDecks.userDeckSelection).toBeCalledWith({ pageNumber: 0, pageSize: 100, userId: 1 })
        })

        it('should get guest decks if no token', async () => {
            mockedDecks.deckSelection.mockResolvedValue({ rows: [] } as QueryResult)

            await supertest(app)
                .get('/decks/selection')
                .expect('Content-Type', /json/)
                .expect(200)


            expect(mockedDecks.getUserDecks).not.toBeCalled();
            expect(mockedDecks.deckSelection).toBeCalledWith({ pageNumber: 0, pageSize: 100 })
        })

        it('should get guest decks if bad token', async () => {
            mockedDecks.deckSelection.mockResolvedValue({ rows: [] } as QueryResult)

            const token = jwt.sign('bad', 'token')
            await supertest(app)
                .get('/decks/selection')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200)


            expect(mockedDecks.getUserDecks).not.toBeCalled();
            expect(mockedDecks.deckSelection).toBeCalledWith({ pageNumber: 0, pageSize: 100 })
        })
    })

})