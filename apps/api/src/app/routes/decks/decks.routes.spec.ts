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

describe('decks routes', () => {
    let app: Application;

    beforeAll(() => {
        app = new App().app;
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })
    /** DEV_NOTE
     * These tests are fairly specific to the implementation.
     * Should maybe replace these with a broader integration test
     * at some point in the future when it makes sense to do so.
     */
    describe('[GET] /selection', () => {

        it('should have owned and notOwned attributes in successful response if logged in', async () => {
            mockedDecks.getUserDecks.mockResolvedValue({ rows: [] } as QueryResult)
            mockedDecks.userDeckSelection.mockResolvedValue({ rows: [] } as QueryResult)

            // create valid token
            const token = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
            const result = await supertest(app)
                .get('/decks/selection')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(result.body.owned).toBeDefined()
            expect(result.body.notOwned).toBeDefined()

        })

        it('should have owned and notOwned attributes in successful response if not logged in', async () => {
            mockedDecks.guestDeckSelection.mockResolvedValue({ rows: [] } as QueryResult)
            mockedDecks.getFreeDecks.mockResolvedValue({ rows: [] } as QueryResult)


            const result = await supertest(app)
                .get('/decks/selection')
                .expect('Content-Type', /json/)
                .expect(200)

            expect(result.body.owned).toBeDefined()
            expect(result.body.notOwned).toBeDefined()

        })

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
            mockedDecks.guestDeckSelection.mockResolvedValue({ rows: [] } as QueryResult)
            mockedDecks.getFreeDecks.mockResolvedValue({ rows: [] } as QueryResult)

            await supertest(app)
                .get('/decks/selection')
                .expect('Content-Type', /json/)
                .expect(200)

            expect(mockedDecks.getUserDecks).not.toBeCalled();
            expect(mockedDecks.guestDeckSelection).toBeCalledWith({ pageNumber: 0, pageSize: 100 })
        })

        it('should get guest decks if bad token', async () => {
            mockedDecks.guestDeckSelection.mockResolvedValue({ rows: [] } as QueryResult)
            mockedDecks.getFreeDecks.mockResolvedValue({ rows: [] } as QueryResult)

            const token = jwt.sign('bad', 'token')
            await supertest(app)
                .get('/decks/selection')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(mockedDecks.getUserDecks).not.toBeCalled();
            expect(mockedDecks.guestDeckSelection).toBeCalledWith({ pageNumber: 0, pageSize: 100 })
        })
    })

})