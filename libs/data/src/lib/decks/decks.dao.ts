import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';
import { MovieRating, IInsertDeck, DeckSelectionOptions, UserDeckSelectionOptions } from '@whosaidtrue/app-interfaces';


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
            text: 'SELECT id, name, sort_order, clean, age_rating, movie_rating, sfw, status, description, purchase_price, example_question, thumbnail_url FROM active_decks WHERE id = $1',
            values: [id]
        }
        return this.pool.query(query);
    }

    public insertOne(deck: IInsertDeck): Promise<QueryResult> {
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
    public lessThanAgeRating(ageRating: number): Promise<QueryResult> {
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
    public getUserDecks(userId: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from user_owned_decks($1)',
            values: [userId]
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
    public getNotOwned(userId: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from user_not_owned_decks($1)',
            values: [userId]
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
    public userDeckSelection(options: UserDeckSelectionOptions): Promise<QueryResult> {
        const { userId, pageNumber, pageSize, ageRating } = options;

        let queryString: string;
        let valuesArray: number[];

        if (!ageRating) {
            queryString = 'SELECT * FROM user_not_owned_decks($1) ORDER BY id OFFSET $2 LIMIT $3';
            valuesArray = [userId, pageNumber * pageSize, pageSize]
        } else {
            queryString = 'SELECT * FROM user_not_owned_decks($1) AS u_o WHERE u_o.age_rating < $4 ORDER BY id OFFSET $2 LIMIT $3';
            valuesArray = [userId, pageNumber * pageSize, pageSize, ageRating]
        }

        const query = {
            text: queryString,
            values: valuesArray
        }
        return this.pool.query(query)
    }

    /**
     * Call this method when someone that doesn't have an account
     * needs to be shown some decks.
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
    public deckSelection(options: DeckSelectionOptions): Promise<QueryResult> {
        const { pageNumber, pageSize, ageRating } = options;

        let queryString: string;
        let valueArray: number[];
        if (!ageRating) {
            queryString = `SELECT * from active_decks ORDER BY id OFFSET $1 LIMIT $2`
            valueArray = [pageNumber * pageSize, pageSize]
        } else {
            queryString = `SELECT * from active_decks WHERE active_decks.age_rating < $3 ORDER BY id OFFSET $1 LIMIT $2`
            valueArray = [pageNumber * pageSize, pageSize, ageRating]
        }

        const query = {
            text: queryString,
            values: valueArray
        }

        return this.pool.query(query)
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

    /** TODO: replace this with real implementation.
     * Create an order record for a deck/user.
     *
     * THIS IS A TEMPORARY FAKE IMPLEMENTATION.
     */
    public purchase(deckId: number, userId: number, purchase_price: string): Promise<QueryResult> {

        const query = {
            text: 'INSERT INTO orders (deck_id, user_id, fulfilled_on, purchase_price) VALUES ($1, $2, $3, $4) returning id',
            values: [deckId, userId, new Date().toISOString(), purchase_price]
        }
        return this.pool.query(query)
    }
    // TODO: need this?
    // public async checkIfUserOwns(deckId: number): Promise<QueryResult> {}

}

export default Decks;