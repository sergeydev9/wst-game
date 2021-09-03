import { DatabaseError, Pool } from 'pg';
import { TEST_DB_CONNECTION } from '../util/testDbConnection';
import { cleanDb } from '../util/cleanDb';
import Orders from './Orders.dao';
import Users from '../users/Users.dao';
import Decks from '../decks/decks.dao';
import { setupOneDeck } from '../util/testDependencySetup';

describe('Orders', () => {
    let pool: Pool;
    let orders: Orders;
    let decks: Decks;
    let users: Users;
    let userId: number;
    let deckId: number;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION)
        orders = new Orders(pool)
        users = new Users(pool)
        decks = new Decks(pool)
    })

    beforeEach(async () => {
        await cleanDb(pool)
    })

    afterAll(() => {
        pool.end()
    })

    describe('purchaseWithCredits', () => {

        beforeEach(async () => {
            deckId = await setupOneDeck(pool)
            const { rows } = await users.register('email@test.com', 'password123')
            userId = rows[0].id
        })
        it('should return a user_id if successful', async () => {
            await users.setCredits(userId, 5)
            const result = await orders.purchaseWithCredits(userId, deckId)
            expect(result).toEqual(userId)
        })

        it('should return undefined if user has no credits', async () => {
            const result = await orders.purchaseWithCredits(userId, deckId)
            expect(result).not.toBeDefined()
        })

        it('should create a user_deck record if successful', async () => {
            await users.setCredits(userId, 5)
            await orders.purchaseWithCredits(userId, deckId)
            const { rows } = await decks.getUserDecks(userId);

            expect(rows.filter(el => el.id === deckId).length).toEqual(1)
        })

        it("should throw if deck doesn't exist", async () => {
            await users.setCredits(userId, 5)
            try {
                await orders.purchaseWithCredits(userId, 0)
            } catch (e) {
                expect(e).toEqual(new DatabaseError('insert or update on table "orders" violates foreign key constraint "orders_deck_id_fkey"', 1, 'error'))
            }
        })
    })
})