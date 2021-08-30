import { UserDetailsUpdate } from '@whosaidtrue/app-interfaces';
import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';

class Users extends Dao {
    constructor(pool: Pool) {
        super(pool, 'users');
    }
    /**
     * Insert a new user.
     *
     * WARNING: ENCRYPTION HAPPENS IN THE DATABASE. DO NOT ENCRYPT PASSWORD BEFORE
     * CALLING THIS METHOD. IF YOU DO, THE PASSWORD WILL NOT BE VERIFYABLE.
     *
     * If request successful, results object will have a 'rows' array length 1,
     * containing an object with the id, email and roles of the inserted user.
     *
     * @throws {DatabaseError}
     * Will throw exception if a user already exists with provided email,
     *
     * @example
     * const result = await users.register('test@example.com','password');
     * // result.rows = [{id: 1, email: 'test@example.com', roles: ['user'], notifications: false}]
     *
     * @param {Partial<User>} user
     * @return {Promise<QueryResult>}
     * @memberof Users
     */
    public register(email: string, password: string): Promise<QueryResult> {
        const query = {
            text: "INSERT INTO users (email, password, roles) VALUES ( $1, crypt($2, gen_salt('bf', 8)), $3) RETURNING id, email, roles",
            values: [email, password, ["user"]]
        }
        return this._pool.query(query);
    }

    /**
     * For authenticated users to change their passwords on the 'Change Password' screen.
     *
     * If old password is wrong, returns empty array.
     * @param id
     * @param oldPass
     * @param newPass
     * @returns
     */
    public changePassword(id: number, oldPass: string, newPass: string): Promise<QueryResult> {
        const query = {
            text: `UPDATE users SET password = crypt($1, gen_salt('bf', 8)) WHERE (users.id = $2 AND users.password = crypt($3, password)) RETURNING id`,
            values: [newPass, id, oldPass]
        }
        return this._pool.query(query)
    }

    /**
     * For use in pasword resetting (i.e. email reset), NOT the 'change password' feature.
     * @param id
     * @param password
     * @returns
     */
    public updatePassword(id: number, password: string): Promise<QueryResult> {
        const query = {
            text: `UPDATE users SET password = crypt($1, gen_salt('bf', 8)) WHERE id = $2`,
            values: [password, id]
        }
        return this._pool.query(query)
    }

    public updateEmail(id: number, email: string): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET email = $1 WHERE id = $2 RETURNING email',
            values: [email, id]
        };
        return this._pool.query(query)

    }

    // TODO: add notifications to this when that feature is rolled out.
    public updateDetails(id: number, update: UserDetailsUpdate): Promise<QueryResult> {
        const { email } = update
        const query = {
            text: 'UPDATE users SET email = $1 WHERE id = $2 RETURNING email',
            values: [email, id]
        };
        return this._pool.query(query)

    }

    /**
     * Set user's credits to specified value.
     *
     * @returns {Promise<QueryResult>} result.rows = [{question_deck_credits: NEW_VALUE}]
     */
    public setCredits(userId: number, value: number): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET question_deck_credits = $2 WHERE id = $1 RETURNING question_deck_credits',
            values: [userId, value]
        };
        return this._pool.query(query)
    }

    /**
     * Set a reset_code on a user row.
     *
     * returns the email if successful.
     *
     * Returns an empty array if there was no user with that email.
     * @param email
     * @param code
     * @returns
     */
    public setResetCode(email: string, code: string): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET reset_code = $2 WHERE email = $1 RETURNING email, reset_code',
            values: [email, code]
        };
        return this._pool.query(query)
    }

    /**
     * Reduce the user's remaining credits by 1 iff they have credits remaining.
     *
     *
     * @example
     * // initial_user_value = {id: 5, ..., question_deck_credits: 1}
     * const result = await users.reduceCredits(5);
     *
     * result.rows[0] // {question_deck_credits: 0}
     *
     * @returns {Promise<QueryResult>} result.rows = [{question_deck_credits: NEW_VALUE}]
     */
    public reduceCredits(userId: number): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET question_deck_credits = question_deck_credits - 1 WHERE id = $1 AND question_deck_credits > 0 RETURNING question_deck_credits',
            values: [userId]
        };
        return this._pool.query(query)
    }

    /**
     * Set user's notifications to the specified value
     *
     * Returns an object with the new value of "notifications"
     *
     *
     * @example
     * // initial_user_value = {id: 5, ..., notifications: false}
     *
     * const result = await users.toggleNotifications(5, true);
     * result.rows[0] // {notifications: true}
     *
     * @return {Promise<QueryResult>}
     * @memberof Users
     */
    public toggleNotifications(userId: number, value: boolean): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET notifications = $1 WHERE id = $2 RETURNING notifications',
            values: [value, userId]
        };
        return this._pool.query(query)
    }

    /**
     * User account details for the 'My Account' page.
     *
     * @return {Promise<QueryResult>}
     * @memberof Users
     */
    public getDetails(userId: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT id, email, array_to_json(roles) AS roles, question_deck_credits, notifications FROM users WHERE id = $1',
            values: [userId]
        };
        return this._pool.query(query)
    }

    /**
     * Log user in. Returns empty rows array if password is incorrect.
     *
     * @param {string} email
     * @param {string} password
     * @return  {Promise<QueryResult>} {id, email, roles[], notifications}
     * @memberof Users
     */
    public login(email: string, password: string): Promise<QueryResult> {
        const query = {
            text: 'SELECT id, email, array_to_json(roles) AS roles FROM users WHERE email = $1 AND password = crypt($2, password)',
            values: [email, password]
        }
        return this._pool.query(query)
    }
}

export default Users;