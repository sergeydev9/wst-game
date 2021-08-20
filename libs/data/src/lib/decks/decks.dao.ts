import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';
import { MovieRating, IInsertDeck } from '@whosaidtrue/app-interfaces';


class Decks extends Dao {

    constructor(pool: Pool) {
        super(pool, 'decks')
    }

    /**
     * Override base getById method to avoid returning inactive decks.
     *
     * @param {number} id
     * @return {*}  {Promise<QueryResult>}
     * @memberof Decks
     */
    public async getById(id: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from active_decks WHERE id = $1',
            valeus: [id]
        }
        return this.pool.query(query);
    }

    public async insertOne(deck: IInsertDeck): Promise<QueryResult> {
        const {
            name,
            sort_order,
            sfw,
            age_rating,
            movie_rating,
            purchase_price,
            status,
            description,
            clean,
            example_question,
            thumbnail_url,
        } = deck;
        const query = {
            text: `INSERT INTO decks (
                name,
                sort_order,
                sfw,
                age_rating,
                movie_rating,
                purchase_price,
                status,
                description,
                clean,
                example_question,
                thumbnail_url
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
            values: [
                name,
                sort_order,
                sfw,
                age_rating,
                movie_rating,
                purchase_price,
                status,
                description,
                clean,
                example_question,
                thumbnail_url,
            ]
        }
        return this.pool.query(query);
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
                FROM active_decks AS decks
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
                FROM active_decks AS decks
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

    public async getQuestions(deckId: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from active_questions AS questions WHERE questions.deck_id = $1',
            values: [deckId]
        }
        return this.pool.query(query);
    }


}

export default Decks;