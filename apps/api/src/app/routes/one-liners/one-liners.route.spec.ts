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

        it('should returnmixed clean and dirty decks if request origin = whosaidtrue', async () => {
            mockedOneLiners.getSelection.mockResolvedValue({ rows: [{ text: 'test', clean: false }] } as QueryResult);

            await supertest(app)
                .get('/one-liners')
                .set('origin', 'https://www.whosaidtrue.com')
                .expect(200)

            expect(mockedOneLiners.getSelection).toHaveBeenCalledWith(false);
        })

        it('should return clean decks if request origin = whosaidtrueforschools', async () => {
            mockedOneLiners.getSelection.mockResolvedValue({ rows: [{ text: 'test', clean: true }] } as QueryResult);

            await supertest(app)
                .get('/one-liners')
                .set('origin', 'https://www.whosaidtrueforschools.com')
                .expect(200)

            expect(mockedOneLiners.getSelection).toHaveBeenCalledWith(true);
        })

        it('should unescape new line characters', async () => {
            mockedOneLiners.getSelection.mockResolvedValue({ rows: [{ text: 'test\\n', clean: true }] } as QueryResult);

            const { body } = await supertest(app)
                .get('/one-liners')
                .set('origin', 'https://www.whosaidtrueforschools.com')
                .expect(200)

            expect(body.oneLiners[0].text).toEqual('test\n')
        })

        it('should replace line break with new line', async () => {
            mockedOneLiners.getSelection.mockResolvedValue({ rows: [{ text: 'test</br>', clean: true }] } as QueryResult);

            const { body } = await supertest(app)
                .get('/one-liners')
                .set('origin', 'https://www.whosaidtrueforschools.com')
                .expect(200)

            expect(body.oneLiners[0].text).toEqual('test\n')
        })

        it('should replace line break and space with new line', async () => {
            mockedOneLiners.getSelection.mockResolvedValue({ rows: [{ text: 'test</ br>', clean: true }] } as QueryResult);

            const { body } = await supertest(app)
                .get('/one-liners')
                .set('origin', 'https://www.whosaidtrueforschools.com')
                .expect(200)

            expect(body.oneLiners[0].text).toEqual('test\n')
        })
    })
})