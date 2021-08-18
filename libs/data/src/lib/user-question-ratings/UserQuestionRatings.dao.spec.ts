import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '../util/testDbConnection';
import { cleanDb } from '../util/cleanDb';
import Users from '../users/Users.dao';
import UserQuestionRatings from './UserQuestionRatings.dao';
import { setupQuestion } from '../util/testDependencySetup';

describe('UserQuestionRating', () => {
    let pool: Pool;
    let ratings: UserQuestionRatings;
    let users: Users;
    let userId: number;
    let question_ids: number[];

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        ratings = new UserQuestionRatings(pool);
        users = new Users(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
        // insert user
        const { rows } = await users.register({ email: 'test-question-rating@test.com', password: 'password', roles: ["user"] });
        userId = rows[0].id

        // insert questions
        question_ids = (await setupQuestion(pool)).question_ids;
    })

    afterAll(() => {
        pool.end();
    })

    describe('submit', () => {
        it('should successfully submit if value = great', async () => {
            const { rows } = await ratings.submit({ user_id: userId, question_id: question_ids[0], rating: 'great' })
            expect(rows.length).toEqual(1)
        })

        it('should successfully submit if value = bad', async () => {
            const { rows } = await ratings.submit({ user_id: userId, question_id: question_ids[0], rating: 'bad' })
            expect(rows.length).toEqual(1)
        })
    })
})