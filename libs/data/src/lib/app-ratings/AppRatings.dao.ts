import { UserRating } from '@whosaidtrue/app-interfaces';
import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';


class AppRatings extends Dao {
    constructor(pool: Pool) {
        super(pool, 'user_app_ratings');
    }

    /**
     * Get an apprating for a specified user. Returns an empty array if none
     * exists.
     *
     * @param {number} userId
     * @return {QuestionRating}  {Promise<QueryResult>}
     * @memberof QuestionRatings
     */
    getByUserId(userId: number): Promise<QueryResult> {

        const query = {
            text: `
                SELECT rating FROM user_app_ratings
                WHERE user_id = $1`,
            values: [userId]
        }

        return this.pool.query(query);
    }

    /**
     * Insert a new app ratings row for a user
     *
     * @param {number} userId
     * @param {UserRating} rating
     * @return {*}  {Promise<QueryResult>}
     * @memberof AppRatings
     */
    submitRating(userId: number, rating: UserRating): Promise<QueryResult> {
        const query = {
            text: `
                INSERT INTO user_app_ratings (user_id, rating)
                VALUES ($1, $2)`,
            values: [userId, rating]
        }

        return this.pool.query(query)
    }
}
export default AppRatings;