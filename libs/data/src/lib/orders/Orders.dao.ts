import { Pool } from 'pg';
import Dao from '../base.dao';

class Orders extends Dao {
    constructor(pool: Pool) {
        super(pool, 'orders')
    }

    public async purchaseWithCredits(userId: number, deckId: number): Promise<number | undefined> {
        const client = await this.pool.connect();

        try {
            // start transaction
            await client.query('BEGIN')

            // reduce user's credits by 1 if they have credits.
            const reduceQuery = {
                text: 'UPDATE users SET question_deck_credits = question_deck_credits - 1 WHERE id = $1 AND question_deck_credits > 0 RETURNING id',
                values: [userId]
            }
            const reduceResponse = await client.query(reduceQuery)

            if (!reduceResponse.rows[0]) {
                // if no user was updated, then either the user has been deleted,
                // or they don't actually have any credits left.
                return
            }
            // create new order record
            const createOrderQuery = {
                text: 'INSERT INTO  orders (status, user_id, deck_id, credits_used) VALUES ($1, $2, $3, $4)',
                values: ["fulfilled", userId, deckId, true]
            }
            await client.query(createOrderQuery)

            // create a new user_deck with user id and deck id
            const createUserDeckQuery = {
                text: 'INSERT INTO user_decks (user_id, deck_id) VALUES ($1, $2) RETURNING user_id',
                values: [userId, deckId]
            }
            const insertResult = await client.query(createUserDeckQuery);
            await client.query('COMMIT')

            // on success, return user_id
            return insertResult.rows[0].user_id

        } catch (e) {
            await client.query('ROLLBACK')
            throw e // rethrow and catch in caller
        } finally {
            client.release()
        }
    }
}

export default Orders