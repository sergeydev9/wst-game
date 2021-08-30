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

    afterAll(() => {
        pool.end()
    })

    describe('updateEmail', () => {
        let userId: number;

        beforeEach(async () => {
            // save user and store id
            const { rows } = await users.register('test@test.com', 'password');
            userId = rows[0].id;
        })

        it('should update email and return new value', async () => {
            const { rows } = await users.updateEmail(userId, 'new@test.com');
            expect(rows[0].email).toEqual('new@test.com')
        })
    })

    describe('register', () => {
        const userEmail = 'test_register@test.com';
        it('should register user', async () => {
            const { rows } = await users.register(userEmail, 'password');
            expect(rows.length).toEqual(1);
            expect(rows[0].id).toBeDefined();
            expect(rows[0].email).toEqual(userEmail);
            expect(rows[0].roles.length).toEqual(1);
            expect(rows[0].roles[0]).toEqual('user')

        })

        it('should encrypt the password', async () => {
            await users.register(userEmail, 'password');
            const { rows } = await users.pool.query({ text: 'SELECT * FROM users WHERE email = $1', values: [userEmail] });
            const { password } = rows[0];

            expect(password.startsWith('$2a$08$')).toEqual(true)
        })
    })

    describe('changePassword', () => {
        const password = 'password';
        const email = 'test@test.com';
        let userId: number;

        beforeEach(async () => {
            const { rows } = await users.register(email, password);
            userId = rows[0].id;
        })

        it('should successfully change the password', async () => {
            const newPass = 'newPassword';
            const { rows } = await users.changePassword(userId, password, newPass)
            const actual = await users.login(email, newPass)

            expect(rows[0].id).toEqual(userId)
            expect(actual.rows.length).toEqual(1)
            expect(actual.rows[0].email).toEqual(email)

        })

        it('should encrypt the new password with bf8', async () => {
            await users.changePassword(userId, password, 'newPassword')
            const { rows } = await users.getById(userId)
            expect(rows[0].password.startsWith('$2a$08$')).toEqual(true)

        })

        it('should return an empty array if password is incorrect', async () => {
            const newPass = 'newPassword';
            const { rows } = await users.changePassword(userId, 'wrong', 'newPassword')
            const actual = await users.login(email, newPass)

            expect(rows[0]).not.toBeDefined()
            expect(actual.rows.length).toEqual(0)
            expect(actual.rows[0]).not.toBeDefined()

        })
    })

    describe('getDetails', () => {
        const password = 'password';
        const email = 'test@test.com';
        let userId: number;

        beforeEach(async () => {
            const { rows } = await users.register(email, password);
            userId = rows[0].id;
        })

        it('should return id, email, notifications, roles, question_deck_credits, and not password', async () => {
            const { rows } = await users.getDetails(userId);
            const { id, email, roles, notifications, question_deck_credits } = rows[0]

            expect(id).toBeDefined();
            expect(email).toEqual(email);
            expect(notifications).toBeDefined();
            expect(roles.length).toBeGreaterThan(0);
            expect(question_deck_credits).toBeDefined();
            expect(rows[0].password).not.toBeDefined();
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
            expect(rows[0].id).toBeDefined();
            expect(rows[0].email).toEqual(email);
            expect(rows[0].roles.length).toEqual(1)
            expect(rows[0].roles[0]).toEqual('user')
        })

        it('should return empty rows if password is incorrect', async () => {
            const { rows } = await users.login(email, 'wrong');
            expect(rows.length).toEqual(0);
        })
    })

    // TODO: Refactor these tests and split them up into separate describe blocks
    // for each method.
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
                expect(e).toEqual(new DatabaseError("duplicate key value violates unique constraint \"users_email_key\"", 1, "error"))
            }
        })

        it('should set game credits', async () => {
            const { rows } = await users.setCredits(userId, 5);
            expect(rows[0].question_deck_credits).toEqual(5)
        })
        it('should get user account details', async () => {
            const { rows } = await users.getDetails(userId);

            expect(rows[0].email).toEqual('test@test.com');
            expect(rows[0].notifications).toEqual(false);
            expect(rows[0].question_deck_credits).toEqual(0);
        })

    })

    describe('createGuest', () => {
        it('should create a guest and return id, email, and array of roles', async () => {
            const { rows } = await users.createGuest('test@test.com')

            expect(rows[0].id).toBeDefined()
            expect(rows[0].email).toEqual('test@test.com')
            expect(rows[0].roles.length).toEqual(1)
            expect(rows[0].roles[0]).toEqual('user')

        })

        it('should throw duplicate key error if user already exists with that email', async () => {
            await users.register('test@test.com', 'abcd'); // register user
            try {
                // try to duplicate
                await users.createGuest('test@test.com')
            } catch (e) {
                expect(e).toEqual(new DatabaseError("duplicate key value violates unique constraint \"users_email_key\"", 1, "error"))
            }
        })
    })

    describe('upsertResetCode', () => {
        const userEmail = 'test@test.com'

        beforeEach(async () => {
            // insert initial user before each test
            await users.register(userEmail, 'password123');
        })

        it('should create a new reset code and return the email address', async () => {
            const { rows } = await users.upsertResetCode(userEmail, '1234');
            expect(rows[0].email).toEqual(userEmail)
        })

        it('should update and not insert if user already has a code', async () => {
            await users.upsertResetCode(userEmail, '1234'); // first upsert
            const firstTotal = await pool.query('SELECT * FROM reset_codes'); // get all codes
            const { rows } = await users.upsertResetCode(userEmail, '1235'); // upsert again
            const secondTotal = await pool.query('SELECT * FROM reset_codes'); // get all codes after second upsert

            expect(rows[0].email).toEqual(userEmail) // got email back
            expect(secondTotal.rows.length).toEqual(1) // it didn't insert a second one
            expect(secondTotal.rows[0].code).not.toEqual(firstTotal.rows[0].code) // it correctly updated the first one

        })

        it("should return empty array if user doesn't exist", async () => {
            const { rows } = await users.upsertResetCode('notReal@email.com', '1234');
            expect(rows.length).toEqual(0)

        })
    })

    describe('verifyResetCode', () => {
        const userEmail = 'test@test.com'
        const code = '1234'

        beforeEach(async () => {
            // insert initial user before each test
            await users.register(userEmail, 'password123');
            await users.upsertResetCode(userEmail, code);
        })

        it('should return user_email if code was correct', async () => {
            const { rows } = await users.verifyResetCode(userEmail, code)
            expect(rows.length).toEqual(1);
            expect(rows[0].user_email).toEqual(userEmail)
        })

        it('should return empty array if code was wrong', async () => {
            const { rows } = await users.verifyResetCode(userEmail, '1235')
            expect(rows.length).toEqual(0);
        })

        it('should match using email AND reset code, not just code', async () => {
            const secondEmail = 'test2@test.com';
            await users.register(secondEmail, 'password123');
            await users.upsertResetCode(secondEmail, code);
            const { rows } = await users.verifyResetCode(secondEmail, code)

            expect(rows.length).toEqual(1)
            expect(rows[0].user_email).toEqual(secondEmail)
        })
    })

    describe('resetPassword', () => {
        const userEmail = 'test@test.com'

        beforeEach(async () => {
            // insert initial user before each test
            await users.register(userEmail, 'password123');
        })

        it('should return auth object', async () => {
            const { rows } = await users.resetPassword(userEmail, 'password12345');
            expect(rows[0].id).toBeDefined();
            expect(rows[0].email).toEqual(userEmail)
            expect(rows[0].roles[0]).toEqual('user')
        })

        it('should change the password', async () => {
            await users.resetPassword(userEmail, 'password12345');
            const fail = await users.login(userEmail, 'password123')
            const succeed = await users.login(userEmail, 'password12345');

            expect(fail.rows.length).toEqual(0)
            expect(succeed.rows.length).toEqual(1)


        })

    })
})