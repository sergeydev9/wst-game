import { UserRating } from '@whosaidtrue/app-interfaces';
import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';


class QuestionRatings extends Dao {
    constructor(pool: Pool) {
        super(pool, 'user_question_ratings');
    }

    /**
     * Get a question rating for a specified user. Returns an empty array if none
     * exists.
     *
     * @param {number} userId
     * @param {number} questionId
     * @return {QuestionRating}  {Promise<QueryResult>}
     * @memberof QuestionRatings
     */
    getByUserId(userId: number, questionId: number): Promise<QueryResult> {

        const query = {
            text: `
                SELECT rating FROM user_question_ratings
                WHERE user_id = $1
                AND question_id = $2`,
            values: [userId, questionId]
        }

        return this.pool.query(query);
    }

    submitRating(userId: number, playerId: number, questionId: number, rating: UserRating): Promise<QueryResult> {
        const query = {
            text: `
                INSERT INTO user_question_ratings (user_id, player_id, question_id, rating)
                VALUES ($1, $2, $3, $4)`,
            values: [userId, playerId, questionId, rating]
        }

        return this.pool.query(query)
    }
}
export default QuestionRatings;
