import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';
import { AnswerValue, InsertAnwser } from '@whosaidtrue/app-interfaces';


class Answers extends Dao {
    constructor(pool: Pool) {
        super(pool, 'game_answers')
    }

    /**
     * @deprecated
     * Insert answer record.
     *
     * Result rows[0].id = inserted record id if successfull.
     *
     * @param {SubmitAnswer} answer
     * @return  {Promise<QueryResult>}
     * @memberof Answers
     */
    public async submit(answer: InsertAnwser): Promise<QueryResult> {
        const {
            game_player_id,
            game_question_id,
            game_id,
            value,
            number_true_guess,
            score,
        } = answer;
        const query = {
            text: `INSERT INTO game_answers (
                game_player_id,
                game_question_id,
                game_id,
                value,
                number_true_guess,
                score
                ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
                `,
            values: [game_player_id, game_question_id, game_id, value, number_true_guess, score]
        }
        return this.pool.query(query);
    }

    /**
     * Update value of an answer record.
     *
     * Result rows[0].id = updated record id if successful.
     *
     * @param {number} answer_id
     * @param {AnswerValue} value
     * @return {Promise<QueryResult>}
     */
    public async submitValue(answer_id: number, value: AnswerValue): Promise<QueryResult> {
        const query = {
            text: 'UPDATE game_answers SET value = $1 WHERE id = $2 RETURNING id',
            values: [value, answer_id]
        }
        return this.pool.query(query);
    }

    /**
     * Update number_true_guess of an answer record.
     *
     * Result rows[0].id = updated record id if successful.
     *
     * @param {number} answer_id
     * @param {number} number_true_guess
     * @return {Promise<QueryResult>}
     */
    public async submitGuess(answer_id: number, number_true_guess: number): Promise<QueryResult> {
        const query = {
            text: 'UPDATE game_answers SET number_true_guess = $1 WHERE id = $2 RETURNING id',
            values: [number_true_guess, answer_id]
        };
        return this.pool.query(query);
    }
}

export default Answers