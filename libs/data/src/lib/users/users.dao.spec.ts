import { Pool, DatabaseError } from 'pg';
import { TEST_DB_CONNECTION } from '../util/testDbConnection';
import { cleanDb } from '../util/cleanDb';
import Users from './Users.dao';


describe('Users', () => {
    let pool: Pool;
    let users: Users

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        users = new Users(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
    })

    afterAll(async () => {
        pool.end()
    })

    describe('register', () => {
        const userEmail = 'test_register@test.com';
        it('should register user', async () => {
            const { rows } = await users.register(userEmail, 'password');
            expect(rows.length).toEqual(1);
            expect(rows[0].id).toBeDefined();
            expect(rows[0].email).toBeDefined();
            expect(rows[0].notifications).toBeDefined();


        })

        it('should encrypt the password', async () => {
            await users.register(userEmail, 'password');
            const { rows } = await users.pool.query({ text: 'SELECT * FROM users WHERE email = $1', values: [userEmail] });
            expect(rows[0].password).not.toEqual('password')
        })
    })

    describe('login', () => {
        const password = 'password';
        const email = 'test@test.com';
        beforeEach(async () => {
            await users.register(email, password);
        })

        it('should return user data if password is correct', async () => {
            const { rows } = await users.login(email, password);
            expect(rows[0].email).toEqual(email);
            expect(rows[0].roles[0]).toEqual("user")
            expect(rows[0].notifications).toEqual(false)

        })

        it('should return empty rows if password is incorrect', async () => {
            const { rows } = await users.login(email, 'wrong');
            expect(rows.length).toEqual(0);
        })
    })


    describe('with existing user', () => {
        let userId: number;

        beforeEach(async () => {
            // save user and store id
            const { rows } = await users.register('test@test.com', 'password');
            userId = rows[0].id;
        })
        it('should throw error if email is duplicate', async () => {
            try {
                // attempt duplicate
                await users.register('test@test.com', 'passwordx')
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