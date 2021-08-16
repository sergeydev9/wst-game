import { Pool, DatabaseError } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { UserRole } from '@whosaidtrue/app-interfaces';
import Users from './users.dao';


describe('Users dao', () => {
    let pool: Pool;
    let users: Users

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        await pool.connect();

        users = new Users(pool);
    })

    afterEach(async () => {
        await pool.query(`DELETE FROM users WHERE id > 0`);
    })

    afterAll(async () => {
        pool.end()
    })

    it('should insert one user', async () => {
        const actual = await users.insertOne({ email: 'test@test.com', password: 'password', roles: ["user"] });
        expect(actual.rows.length).toEqual(1);
    })

    it('should throw error if email is duplicate', async () => {
        // initial insert
        await users.insertOne({ email: 'test@test.com', password: 'password', roles: ["user"] })
        try {
            // attempt duplicate
            await users.insertOne({ email: 'test@test.com', password: 'passwordx', roles: ["user"] })
        } catch (e) {
            const expected = new DatabaseError("duplicate key value violates unique constraint \"users_email_key\"", 1, "error")
            expect(e.message).toEqual(expected.message)
        }
    })

    it('should throw an exception if roles is not a value defined in the type', async () => {
        try {
            await users.insertOne({ email: 'test@test.com', password: 'password', roles: ["gibberish" as UserRole] })

        } catch (e) {
            const expected = new DatabaseError("invalid input value for enum user_role: \"gibberish\"", 1, "error")
            expect(e.message).toEqual(expected.message);
        }

    })

    it('should set game credits', async () => {
        // save user
        const { rows } = await users.insertOne({ email: 'test@test.com', password: 'password', roles: ["user"] });
        const actual = await users.setCredits(rows[0].id, 5);

        expect(actual.rows[0].question_deck_credits).toEqual(5)
    })

    it('should reduce credits', async () => {
        // save user
        const { rows } = await users.insertOne({ email: 'test@test.com', password: 'password', roles: ["user"] });
        // set credits to 5
        await users.setCredits(rows[0].id, 5);
        // reduce
        const actual = await users.reduceCredits(rows[0].id);
        expect(actual.rows[0].question_deck_credits).toEqual(4)
    })
})