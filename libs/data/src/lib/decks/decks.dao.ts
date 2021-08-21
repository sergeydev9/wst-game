import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';
import { MovieRating, IInsertDeck } from '@whosaidtrue/app-interfaces';


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
    public async getDetails(id: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT id, name, sort_order, clean, age_rating, movie_rating, sfw, status, description, purchase_price, example_question, thumbnail_url FROM active_decks WHERE id = $1',
            values: [id]
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
     * @return {*}  {Promise<QueryResult>}
     * @memberof Decks
     */
    public async getNotOwned(userId: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from user_not_owned_decks($1)',
            values: [userId]
        }
        return this.pool.query(query);
    }


    /**
     * Returns 2 sets of decks - owned decks, and not owned decks.
     *
     * The set of owned decks is comprehensive. It's every deck the
     * specified user owns.
     *
     * The not owned decks are a paginated subset of all decks, with the
     * option to filter by age rating.
     *
     * This method should be triggered when a logged in user first attempts
     * to create a game and their owned decks haven't been fetched yet.
     *
     * If they already have their owned decks in client memory, or they are
     * createing a game as a guest user. call the "deckSelectionWithoutOwned" method instead.
     *
     *  @param {number} userId
     * @param {number} [pageSize=30]
     * @param {number} [page=0]
     * @param {number} [age_rating=1000]
     * @return {{owned: Deck[], not_owned: Deck[]}}  {Promise<QueryResult>}
     * @memberof Decks
     */
    public async selectionWithOwned(userId: number, pageSize = 30, page = 0, age_rating: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from selection_with_owned($1, $2, $3, $4)',
            values: [userId, pageSize, page, age_rating]
        }
        return this.pool.query(query)
    }

    /**
     *
     *
     * @param {number} [pageSize=30]
     * @param {number} [page=0]
     * @param {number} age_rating
     * @return {{not_owned: Deck[]}}  {Promise<QueryResult>}
     * @memberof Decks
     */
    public async selectionWithoutOwned(pageSize = 30, page = 0, age_rating: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from selection_without_owned($1, $2, $3)',
            values: [pageSize, page, age_rating]
        }

        return this.pool.query(query)
    }

    // public async deckSelectionWithoutOnwed(userId: number): Promise<QueryResult>{}

    public async getQuestions(deckId: number): Promise<QueryResult> {
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
    public async purchase(deckId: number, userId: number, purchase_price: string): Promise<QueryResult> {

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