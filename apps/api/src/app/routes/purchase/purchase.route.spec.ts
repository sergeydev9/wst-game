import supertest from 'supertest';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';
import { signUserPayload } from '@whosaidtrue/middleware';
import App from '../../App';
import { orders } from '../../db';

jest.mock('../../services');
jest.mock('../../db');

const mockedOrders = mocked(orders, true);

describe('purchase routes', () => {
    let app: Application;
    const validToken = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })

    beforeAll(() => {
        app = new App().app
    })

    describe('[POST] /credits', () => {

        it('should respond with 422 if no deckId', done => {
            supertest(app)
                .post('/purchase/credits')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(422, done)
        })

        it('should respond with 401 if no token', done => {
            supertest(app)
                .post('/purchase/credits')
                .send({ deckId: 15 })
                .expect(401, done)
        })
        it('should respond with 400 if result from service is undefined', done => {
            mockedOrders.purchaseWithCredits.mockResolvedValue(undefined)
            supertest(app)
                .post('/purchase/credits')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ deckId: 15 })
                .expect(400, done)
        })

        it('should respond with 201 if result from service is a deck id', done => {
            mockedOrders.purchaseWithCredits.mockResolvedValue(15)
            supertest(app)
                .post('/purchase/credits')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ deckId: 15 })
                .expect(201, done)
        })
    })
})