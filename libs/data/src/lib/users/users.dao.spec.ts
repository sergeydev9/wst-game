import { Pool, DatabaseError } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { UserRole } from '@whosaidtrue/app-interfaces';
import Users from './users.dao';


describe('Users dao', () => {
    let pool: Pool;
    let users: Users

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);

        await pool.query(`DELETE FROM users WHERE id > 0`);
        users = new Users(pool);
    })

    beforeEach(async () => {
        await pool.query(`DELETE FROM users WHERE id > 0`);
    })

    afterAll(async () => {
        pool.end()
    })

    it('should insert one user', async () => {
        const actual = await users.insertOne({ email: 'test@test.com', password: 'password', roles: ["user"] });
        expect(actual.rows.length).toEqual(1);
    })

    it('should throw an exception if roles is not a value defined in the type', async () => {
        try {
            await users.insertOne({ email: 'test@test.com', password: 'password', roles: ["gibberish" as UserRole] })

        } catch (e) {
            const expected = new DatabaseError("invalid input value for enum user_role: \"gibberish\"", 1, "error")
            expect(e.message).toEqual(expected.message);
        }

    })

    describe('with existing user', () => {
        let userId: number;

        beforeEach(async () => {
            // save user and store id
            const { rows } = await users.insertOne({ email: 'test@test.com', password: 'password', roles: ["user"] });
            userId = rows[0].id;
        })
        it('should throw error if email is duplicate', async () => {
            try {
                // attempt duplicate
                await users.insertOne({ email: 'test@test.com', password: 'passwordx', roles: ["user"] })
            } catch (e) {
                const expected = new DatabaseError("duplicate key value violates unique constraint \"users_email_key\"", 1, "error")
                expect(e.message).toEqual(expected.message)
            }
        })

        it('should set game credits', async () => {
            const { rows } = await users.setCredits(userId, 5);
            expect(rows[0].question_deck_credits).toEqual(5)
        })

        it('should reduce credits', async () => {
            // set credits to 5
            await users.setCredits(userId, 5);
            // reduce
            const { rows } = await users.reduceCredits(userId);
            expect(rows[0].question_deck_credits).toEqual(4)
        })

        it('should get user account details', async () => {
            const { rows } = await users.getDetails(userId);

            expect(rows[0].email).toEqual('test@test.com');
            expect(rows[0].notifications).toEqual(false);
            expect(rows[0].question_deck_credits).toEqual(0);
        })

        it('should set notifications to true', async () => {
            const { rows } = await users.toggleNotifications(userId);
            expect(rows[0].notifications).toEqual(true)
        })
    })
})