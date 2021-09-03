import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '../util/testDbConnection';
import { cleanDb } from '../util/cleanDb';
import Orders from './Orders.dao';
import Users from '../users/Users.dao';
import { setupOneDeck } from '../util/testDependencySetup';

describe('Orders', () => {
    let pool: Pool;
    let orders: Orders;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        orders = new Orders(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
    })

    afterAll(() => {
        pool.end()
    })

    describe('purchaseWithCredits', () => {
        let deckId: number;

        beforeEach(async () => {
            deckId = await setupOneDeck(pool)
        })
    })
})