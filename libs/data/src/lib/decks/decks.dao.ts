import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';
import { MovieRating } from '@whosaidtrue/app-interfaces';


class Decks extends Dao {

    constructor(pool: Pool) {
        super(pool, 'decks')
    }

    /**
     * Get all decks that have specified movieRating
     *
     * @param {MovieRating} movieRating
     * @return {*}  {Promise<QueryResult>}
     * @memberof Decks
     */
    public async getByMovieRating(movieRating: MovieRating): Promise<QueryResult> {
        const query = {
            text: `SELECT (
                id,
                name,
                sort_order,
                clean,
                age_rating,
                movie_rating,
                sfw,
                description,
                purchase_price,
                example_question,
                thumbnail_url
                )
                FROM active_decks() AS decks
                WHERE decks.movie_rating = $1;`,
            values: [movieRating]
        }
        return this._pool.query(query);
    }
    /**
     * Returns all decks with an age rating less than input
     *
     * @param {number} ageRating
     * @return {*}  {Promise<QueryResult>}
     * @memberof Decks
     */
    public async lessThanAgeRating(ageRating: number): Promise<QueryResult> {
        const query = {
            text: `SELECT (
                id,
                name,
                sort_order,
                clean,
                age_rating,
                movie_rating,
                sfw,
                description,
                purchase_price,
                example_question,
                thumbnail_url
                )
                FROM active_decks() AS decks
                WHERE decks.age_rating < $1;`,
            values: [ageRating]
        }
        return this._pool.query(query);
    }
    /**
     * Gets all decks owned by the specified user.
     * Returns empty array if the user doesn't own any decks.
     *
     * @param {string} userId
     * @return {*}
     * @memberof Decks
     */
    public async getUserDecks(userId: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from user_owned_decks($1)',
            values: [userId]
        }
        return this.pool.query(query);
    }

    public async getNotOwned(userId: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from user_not_owned_decks($1)',
            values: [userId]
        }
        return this.pool.query(query);
    }

}

export default Decks;