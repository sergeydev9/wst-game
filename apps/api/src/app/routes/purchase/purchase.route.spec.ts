import supertest from 'supertest';
import { QueryResult, DatabaseError } from 'pg';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';
import jwt from 'jsonwebtoken';
import App from '../../App';
import { purchaseWithCredits } from '../../services'

jest.mock('../../services');

const mockedPurchases = mocked(purchaseWithCredits, true);

describe('/purchase routes', () => {
    let app: Application;

    beforeAll(() => {
        app = new App().app
    })
})