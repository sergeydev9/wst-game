import { Pool, QueryResult } from 'pg';
import { IInsertUserQuestionRating } from '@whosaidtrue/app-interfaces';
import Dao from '../base.dao';

class UserQuestionRating extends Dao {
    constructor(pool: Pool) {
        super(pool, 'user_question_rating')
    }

    /**
     * Submit a rating for a question.
     *
     * @param {IInsertUserQuestionRating} userRating
     * @return {id}  {Promise<QueryResult>}
     * @memberof UserQuestionRating
     */
    public async submit(userRating: IInsertUserQuestionRating): Promise<QueryResult> {
        const { question_id, user_id, rating } = userRating;
        const query = {
            text: 'INSERT INTO user_question_ratings (question_id, user_id, rating) VALUES ($1, $2, $3) RETURNING id',
            values: [question_id, user_id, rating]
        }

        return this.pool.query(query);
    }
}

export default UserQuestionRating