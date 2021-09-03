import supertest from 'supertest';
import { QueryResult, DatabaseError, PoolClient } from 'pg';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';
import { signUserPayload } from '@whosaidtrue/middleware';
import App from '../../App';
import { purchaseWithCredits } from '../../services'
import { pool } from '../../db';

jest.mock('../../services');
jest.mock('../../db');

const mockedPurchases = mocked(purchaseWithCredits, true);
const mockedPool = mocked(pool, true);

describe('/purchase routes', () => {
    let app: Application;
    const validToken = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })

    beforeAll(() => {
        app = new App().app
    })

    describe('[POST] /credits', () => {
        it('should respond with 400 if result from service is undefined', done => {
            mockedPurchases.mockResolvedValue(undefined)
            supertest(app)
                .post('/purchase/credits')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ deckId: 15 })
                .expect(400, done)
        })
    })
})