import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import insertNamesQuery from '../util/insertNamesQuery';
import { left, right } from '../util/generateName';
import GeneratedNames from './GeneratedNames.dao';

describe('GeneratedNames', () => {
    let pool: Pool;
    let names: GeneratedNames;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        names = new GeneratedNames(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
    })

    afterAll(() => {
        pool.end();
    })

    describe('reportChoices', () => {
        let nameIds: number[];

        beforeEach(async () => {
            const { rows } = await pool.query(insertNamesQuery(30))
            nameIds = rows.map(el => el.id)
        })

        it('should successfully report a set of choices', async () => {
            const chosen = nameIds.pop();
            await Promise.all(names.reportChoices(nameIds, chosen));

            const { rows } = await pool.query('SELECT times_chosen, times_displayed FROM generated_names WHERE id = $1', [chosen])
            expect(rows[0].times_displayed).toEqual(1);
            expect(rows[0].times_chosen).toEqual(1);
        })
    })

    describe('getNameChoices', () => {
        it('should return the correct number of names', async () => {
            //insert names
            await pool.query(insertNamesQuery(500, 50))

            const { rows } = await names.getChoices(9);
            expect(rows.length).toEqual(9)

        })

        it('should only return clean names', async () => {
            // Insert almost only not clean names
            await pool.query(insertNamesQuery(500, 491))
            const { rows } = await names.getChoices(9, true);

            // should return the small subset of clean names
            expect(rows.length).toEqual(9)
            rows.forEach(name => {
                expect(name.clean).toEqual(true)
            })
        })
    })
})