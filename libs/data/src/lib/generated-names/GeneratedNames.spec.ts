import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import GeneratedNames from './GeneratedNames';

describe('GeneratedNames dao', () => {
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
        it('should successfully report a set of choices', async () => {
            //TODO: finish
        })
    })
})