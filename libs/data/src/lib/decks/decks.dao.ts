import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';
import { MovieRating, InsertDeck } from '@whosaidtrue/app-interfaces';


class Decks extends Dao {

    constructor(pool: Pool) {
        super(pool, 'decks')
    }

    /**
     * Get deck details. Returns all columns of active deck except create_at and updated_at.
     *
     * @param {number} id
     * @return {*}  {Promise<QueryResult>}
     * @memberof Decks
     */
    public getDetails(id: number): Promise<QueryResult> {
        const query = {
            text: `
            SELECT
                id,
                name,
                sort_order,
                clean,
                age_rating,
                movie_rating,
                sfw,
                status,
                description,
                purchase_price,
                sample_question,
                thumbnail_url
            FROM active_decks WHERE id = $1`,
            values: [id]
        }
        return this.pool.query(query);
    }

    public insertOne(deck: InsertDeck): Promise<QueryResult> {
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
            sample_question,
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
                sample_question,
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
                sample_question,
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
    public getByMovieRating(movieRating: MovieRating): Promise<QueryResult> {
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
                sample_question,
                thumbnail_url
                )
                FROM active_decks AS decks
                WHERE decks.movie_rating = $1;`,
            values: [movieRating]
        }
        return this._pool.query(query);
    }

    /**
     * Gets all decks owned by the specified user, along with all the free decks.
     *
     * @param {number} userId
     * @param {boolean} clean if true, only returns clean decks, if false, only not clean decks
     */
    public getUserDecks(userId: number, clean: boolean): Promise<QueryResult> {
        const query = {
            text: `
                (
                    SELECT
                        decks.id,
                        decks.name,
                        decks.sort_order,
                        decks.clean,
                        decks.age_rating,
                        decks.movie_rating,
                        decks.sfw,
                        decks.status,
                        decks.description,
                        decks.sample_question,
                        decks.purchase_price,
                        decks.thumbnail_url
                    FROM decks
                    LEFT JOIN user_decks
                    ON user_decks.deck_id = decks.id
                    WHERE user_decks.user_id = $1
                    AND decks.clean = $2
                )
                UNION ALL
                (
                    SELECT * FROM free_decks WHERE free_decks.clean = $2
                )`,
            values: [userId, clean]
        }
        return this.pool.query(query);
    }

    /**
     * Gets all decks not owned by a user.
     *
     * Be careful when using this directly as it will return all decks.
     * This here to provide access to the function in the DB
     * just in case, and for testing.
     *
     * For use in the api, use the methods with pagination.
     *
     * @param {number} userId
     * @return {Deck[]}  {Promise<QueryResult>}
     * @memberof Decks
     */
    public getNotOwned(userId: number, clean: boolean): Promise<QueryResult> {
        const query = {
            text: `
            SELECT * from user_not_owned_decks($1) AS n_owned
            WHERE n_owned.clean = $2
            `,
            values: [userId, clean]
        }
        return this.pool.query(query);
    }


    /**
     * Call this method when someone that does have an account
     * needs to be shown some decks that they don't own.
     *
     * options:
     *  - pageNumber: sets the number of decks to skip
     *
     *  - pageSize: sets the number per page
     *
     *  - ageRating: if present, only decks with rating lower
     *    than this value will be returned
     *
     * @param {DeckSelectionOptions} options
     * @return {Deck[]}  {Promise<QueryResult>}
     * @memberof Decks
     */
    public userDeckSelection(userId: number, pageNumber: number, pageSize: number, clean: boolean): Promise<QueryResult> {

        const query = {
            text: `
                SELECT * FROM user_not_owned_decks($1) AS u_o
                WHERE u_o.clean = $4
                ORDER BY id
                OFFSET $2
                LIMIT $3
            `,
            values: [userId, pageNumber * pageSize, pageSize, clean]
        }
        return this.pool.query(query)
    }

    /**
     * Call this method when someone that doesn't have an account
     * needs to be shown some decks.
     *
     * Only returns decks with purchase price > 0.
     *
     * options:
     *  - pageNumber: sets the number of decks to skip
     *
     *  - pageSize: sets the number per page
     *
     *  - ageRating: if present, only decks with rating lower
     *    than this value will be returned
     *
     * @param {DeckSelectionOptions} options
     * @return {Deck[]}  {Promise<QueryResult>}
     * @memberof Decks
     */
    public guestDeckSelection(pageNumber: number, pageSize: number, clean: boolean): Promise<QueryResult> {


        const query = {
            text: `
                SELECT * from not_free_decks
                WHERE not_free_decks.clean = $3
                ORDER BY id
                OFFSET $1
                LIMIT $2
            `,
            values: [pageNumber * pageSize, pageSize, clean]
        }

        return this.pool.query(query)
    }

    /**
     * Get all free decks.
     */
    public getFreeDecks(clean: boolean): Promise<QueryResult> {
        return this.pool.query('SELECT * FROM free_decks WHERE free_decks.clean = $1', [clean])
    }

    /**
     * Get all active questions for specified deck.
     *
     * @param {number} deckId
     * @return {Question[]}  {Promise<QueryResult>}
     * @memberof Decks
     */
    public getQuestions(deckId: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from active_questions AS questions WHERE questions.deck_id = $1',
            values: [deckId]
        }
        return this.pool.query(query);
    }
}

export default Decks;