import supertest from 'supertest';
import { QueryResult } from 'pg';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';
import App from '../../App';
import { oneLiners } from '../../db';

jest.mock('../../db');
const mockedOneLiners = mocked(oneLiners, true);

describe('one-liners route', () => {
    let app: Application;

    beforeAll(() => {
        app = new App().app
    })

    describe('[GET] /', () => {

        it('should returnmixed clean and dirty decks if request origin = DOMAIN', async () => {
            mockedOneLiners.getSelection.mockResolvedValue({ rows: [{ text: 'test', clean: false }] } as QueryResult);

            await supertest(app)
                .get('/one-liners')
                .set('origin', process.env.DOMAIN)
                .expect(200)

            expect(mockedOneLiners.getSelection).toHaveBeenCalledWith(false);
        })

        it('should return clean decks if request origin = FOR_SCHOOLS_DOMAIN', async () => {
            mockedOneLiners.getSelection.mockResolvedValue({ rows: [{ text: 'test', clean: true }] } as QueryResult);

            await supertest(app)
                .get('/one-liners')
                .set('origin', process.env.FOR_SCHOOLS_DOMAIN)
                .expect(200)

            expect(mockedOneLiners.getSelection).toHaveBeenCalledWith(true);
        })
    })
})