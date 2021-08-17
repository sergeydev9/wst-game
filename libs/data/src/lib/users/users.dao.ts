import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';
import { User } from '../interfaces';

class Users extends Dao {
    constructor(pool: Pool) {
        super(pool, 'users');
    }

    /**
     * Insert a new user.
     *
     * If request successful, results object will have a 'rows' array length 1,
     * containing an object with the id, email and roles of the inserted user.
     *
     * @throws {DatabaseError}
     * Will throw exception if a user already exists with provided email,
     * or if a value in roles array is invalid (i.e. not a member of the defined type)
     *
     * @example
     * const result = await users.insertOne({email: test@example.com, password: 'password', roles: ['user']});
     * // result.rows = [{id: 1, email: 'test@example.com', roles: ['user']}]
     *
     * @param {Partial<User>} user
     * @return {Promise<QueryResult>}
     * @memberof Users
     */
    public async insertOne(user: Partial<User>): Promise<QueryResult> {
        const { email, password, roles } = user;
        const query = {
            text: 'INSERT INTO users ("email", "password", "roles") VALUES ( $1, $2, $3) RETURNING id, email, roles',
            values: [email, password, roles]
        }
        return this._pool.query(query);
    }

    public async updatePassword(id: number, password: string): Promise<QueryResult> {
        const query = {
            text: `UPDATE users SET password = $1 WHERE id = $2`,
            values: [password, id]
        }
        return this._pool.query(query)
    }

    public async updateEmail(id: number, email: string): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET email = $1 WHERE id = $2',
            values: [email, id]
        };
        return this._pool.query(query)

    }

    /**
     * Set user's credits to specified value.
     *
     * @returns {Promise<QueryResult>} result.rows = [{question_deck_credits: NEW_VALUE}]
     */
    public async setCredits(userId: number, value: number): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET question_deck_credits = $2 WHERE id = $1 RETURNING question_deck_credits',
            values: [userId, value]
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
    public async reduceCredits(userId: number): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET question_deck_credits = question_deck_credits - 1 WHERE id = $1 AND question_deck_credits > 0 RETURNING question_deck_credits',
            values: [userId]
        };
        return this._pool.query(query)
    }

    /**
     * Set user's notifications to true if false, and vice versa for the specified user.
     *
     * Returns an object with the new value of "notifications"
     *
     *
     * @example
     * // initial_user_value = {id: 5, ..., notifications: false}
     *
     * const result = await users.reduceCredits(5);
     * result.rows[0] // {notifications: true}
     *
     * @return {Promise<QueryResult>}
     * @memberof Users
     */
    public async toggleNotifications(userId: number): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET notifications = NOT notifications WHERE id = $1 RETURNING notifications',
            values: [userId]
        };
        return this._pool.query(query)
    }

    /**
     * User account details for the 'My Account' page.
     *
     * @return {Promise<QueryResult>}
     * @memberof Users
     */
    public async getDetails(userId: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT email, question_deck_credits, notifications FROM users WHERE id = $1',
            values: [userId]
        };
        return this._pool.query(query)
    }
}

export default Users;