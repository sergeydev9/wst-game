import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import QuestionRatings from './QuestionRatings.dao';
import Users from '../users/Users.dao';
import { setupQuestion } from '../util/testDependencySetup';

describe('AppRatings', () => {
    let pool: Pool;
    let ratings: QuestionRatings;
    let users: Users;
    let userId: number;
    let questionId: number;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        ratings = new QuestionRatings(pool);
        users = new Users(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
        const { rows } = await users.register('email@email.com', 'password123', 'www.test.com')
        userId = rows[0].id;
        const { question_ids } = await setupQuestion(pool);
        questionId = question_ids[0];
    })

    afterAll(() => {
        pool.end();
    })

    describe('submitRating', () => {

        it('should submit a question rating, returning rowcount 1', async () => {
            const actual = await ratings.submitRating(userId, questionId, 'bad');
            expect(actual.rowCount).toEqual(1);
        })
    })

    describe('getByUserId', () => {

        it('should return the rating if one has been submitted', async () => {
            await ratings.submitRating(userId, questionId, 'bad');

            const result = await ratings.getByUserId(userId, questionId);
            const actual = result.rows[0].rating;

            expect(actual).toEqual('bad');
        })

        it('should return a row count 0 if no rating has been submitted', async () => {
            const result = await ratings.getByUserId(userId, questionId);
            expect(result.rowCount).toEqual(0);
        })
    })

})