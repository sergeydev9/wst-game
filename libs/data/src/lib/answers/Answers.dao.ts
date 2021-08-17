import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';
import { IInsertAnwser } from '@whosaidtrue/app-interfaces';


class Answers extends Dao {
    constructor(pool: Pool) {
        super(pool, 'game_answers')
    }

    /**
     * Insert answer record.
     *
     * Result rows[0].id = inserted record id if successfull.
     *
     * @param {ISubmitAnswer} answer
     * @return  {Promise<QueryResult>}
     * @memberof Answers
     */
    public async submit(answer: IInsertAnwser): Promise<QueryResult> {
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
}

export default Answers