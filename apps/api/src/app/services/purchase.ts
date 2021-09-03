import { PoolClient } from 'pg'

export const purchaseWithCredits = async (client: PoolClient, userId: number, deckId: number) => {

    try {
        // start transaction
        await client.query('BEGIN')

        // reduce user's credits by 1 if they have credits.
        const reduceQuery = {
            text: 'UPDATE users SET question_deck_credits = question_deck_credits - 1 WHERE id = $1 AND question_deck_credits > 0 RETURNING id, question_deck_credits',
            values: [userId]
        }
        const reduceResponse = await client.query(reduceQuery)

        if (!reduceResponse.rows[0]) {
            // if no user was updated, then either the user has been deleted,
            // or they don't actually have any credits left.
            client.release();
            return
        }
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