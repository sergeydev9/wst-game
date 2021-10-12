import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';
import { AnswerValue } from '@whosaidtrue/app-interfaces';


class Answers extends Dao {
    constructor(pool: Pool) {
        super(pool, 'game_answers')
    }

    /**
     * Insert an answer along with a true/false/pass value
     *
     * Result rows[0].id = updated record id if successful.
     * @param {number} playerId
     * @param {number} gameQuestionId
     * @param {AnswerValue} value
     * @param {number} gameId
     * @return {Promise<QueryResult>}
     */
    public async submitValue(
        playerId: number,
        gameQuestionId: number,
        gameId: number,
        value: AnswerValue,
    ): Promise<QueryResult> {

        const query = {
            text: `
            INSERT INTO game_answers (
                game_player_id,
                game_question_id,
                game_id,
                value
                )
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
            values: [playerId, gameQuestionId, gameId, value]
        }
        return this.pool.query(query);
    }

    /**
     * Update number_true_guess of an answer record.
     *
     * Result rows[0].id = updated record id if successful.
     *
     * @param {number} answerId
     * @param {number} guess
     * @return {Promise<QueryResult>}
     */
    public async submitGuess(answerId: number, guess: number): Promise<QueryResult> {
        const query = {
            text: `
                UPDATE game_answers
                SET number_true_guess = $1
                WHERE id = $2
                RETURNING id`,
            values: [guess, answerId]
        };
        return this.pool.query(query);
    }
}

export default Answers