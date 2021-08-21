import supertest from 'supertest';
import { QueryResult, DatabaseError } from 'pg';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';

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

})