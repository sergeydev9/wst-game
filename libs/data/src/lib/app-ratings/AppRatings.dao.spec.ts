import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import AppRatings from './AppRatings.dao';
import Users from '../users/Users.dao';

describe('AppRatings', () => {
    let pool: Pool;
    let ratings: AppRatings;
    let users: Users;
    let userId: number;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        ratings = new AppRatings(pool);
        users = new Users(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
        const { rows } = await users.register('email@email.com', 'password123', 'www.test.com')
        userId = rows[0].id;
    })

    afterAll(() => {
        pool.end();
    })

    describe('submitRating', () => {

        it('should submit an app rating, returning rowcount 1', async () => {
            const actual = await ratings.submitRating(userId, 'bad');
            expect(actual.rowCount).toEqual(1);
        })
    })

    describe('getByUserId', () => {

        it('should return the rating if one has been submitted', async () => {
            await ratings.submitRating(userId, 'bad');

            const result = await ratings.getByUserId(userId);
            const actual = result.rows[0].rating;

            expect(actual).toEqual('bad');
        })

        it('should return a row count 0 if no rating has been submitted', async () => {
            const result = await ratings.getByUserId(userId);
            expect(result.rowCount).toEqual(0);
        })
    })

})