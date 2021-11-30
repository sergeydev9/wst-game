import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import format from 'pg-format';
import OneLiners from './OneLiners.dao';

describe('OneLiners', () => {
    let pool: Pool;
    let oneLiners: OneLiners;


    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        oneLiners = new OneLiners(pool);

    })

    afterEach(async () => {
        await cleanDb(pool);
    })

    afterAll(() => {
        pool.end();
    })

    describe('getSelection', () => {

        beforeEach(async () => {
            // 12 dirty, 6 clean
            const testData = [
                ["phrase 1", false],
                ["phrase 2", false],
                ["phrase 3", true],
                ["phrase 4", false],
                ["phrase 5", false],
                ["phrase 6", true],
                ["phrase 7", false],
                ["phrase 8", false],
                ["phrase 9", true],
                ["phrase 10", false],
                ["phrase 11", false],
                ["phrase 12", true],
                ["phrase 13", false],
                ["phrase 14", false],
                ["phrase 15", true],
                ["phrase 16", false],
                ["phrase 17", false],
                ["phrase 18", true]
            ]

            const query = {
                text: format(`
                    INSERT INTO one_liners (text, clean)
                    VALUES %L
                `, testData),
            }

            await pool.query(query);
        })

        it('should return 10 one liners, mixed clean and not clean', async () => {
            const actual = await oneLiners.getSelection(false);
            expect(actual.rowCount).toEqual(10);
            expect(actual.rows.some(item => item.clean === true)).toEqual(true);
            expect(actual.rows.some(item => item.clean === false)).toEqual(true);
        })

        it('should return 6 clean decks', async () => {
            const actual = await oneLiners.getSelection(true);
            expect(actual.rowCount).toEqual(6);
        })
    })
})