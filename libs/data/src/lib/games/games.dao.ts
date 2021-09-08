import { Pool, QueryResult } from 'pg';
import { GameStatus, IInsertGame } from '@whosaidtrue/app-interfaces';
import Dao from '../base.dao';

class Games extends Dao {
    constructor(pool: Pool) {
        super(pool, 'games');
    }

    public insertOne(game: IInsertGame): Promise<QueryResult> {
        const { deck_id, status, access_code } = game;
        const query = {
            text: `INSERT INTO games (
                deck_id,
                status,
                access_code
            ) VALUES ($1, $2, $3) RETURNING id`,
            values: [deck_id, status, access_code]
        }

        return this.pool.query(query);
    }

    public getByAccessCode(code: string): Promise<QueryResult> {
        const query = {
            text: 'SELECT * FROM games WHERE access_code = $1',
            values: [code]
        }
        return this.pool.query(query);
    }

    public setStatus(gameId: number, status: string): Promise<QueryResult> {
        const query = {
            text: 'UPDATE games SET status = $2 WHERE id = $1',
            values: [gameId, status]
        }
        return this.pool.query(query)
    }

    // TODO: finish implementation in DB
    /**
     * Get all the game_questions for the game.
     *
     * @param {number} gameId
     * @return {Promise<QueryResult>}
     * @memberof Games
     */
    // public async getQuestions(gameId: number): Promise<QueryResult> {
    //     const query = {
    //         text: 'SELECT * from get_game_questions($1)',
    //         values: [gameId]
    //     }
    //     return this.pool.query(query)
    // }

    /**
     * Set start_date for game.
     *
     * Returns id and start_date of game.
     *
     * Return value of start_date is a date, not a string.
     *
     * @param {number} game_id
     * @param {Date} date
     * @return {{id: number, start_date: Date}}  {Promise<QueryResult>}
     * @memberof Games
     */
    public setStartDate(game_id: number, date: Date): Promise<QueryResult> {
        const query = {
            text: 'UPDATE games SET start_date = $1 WHERE id = $2 RETURNING id, start_date',
            values: [date.toISOString(), game_id]
        }

        return this.pool.query(query);
    }

    /**
     * Set end_date for game.
     *
     * Returns id and end_date of game.
     *
     * Return value of end_date is a date, not a string.
     *
     * @param {number} game_id
     * @param {Date} date
     * @return {{id: number, start_date: Date}}  {Promise<QueryResult>}
     * @memberof Games
     */
    public setEndDate(game_id: number, date: Date): Promise<QueryResult> {
        const query = {
            text: 'UPDATE games SET end_date = $1 WHERE id = $2 RETURNING id, end_date',
            values: [date.toISOString(), game_id]
        }

        return this.pool.query(query);
    }

    /**
     * Create a new game record, as well as a game_question record
     * for every active question that belongs to the specified deck.
     *
     * Host id is set to the specified user id.
     *
     * Returns a  single row containing the game id and access_code
     * for the new game.
     *
     * @param {number} userId user id of host
     * @param {number} deckId deck id for the game
     * @return {id: number, access_code: string}
     * @memberof Games
     */
    public async create(userId: number, deckId: number): Promise<QueryResult> {

        const client = await this.pool.connect();
        try {

            // create the game and questions.
            const createGameQuery = {
                text: 'SELECT * FROM create_game($1, $2)',
                values: [userId, deckId]
            }
            const gameResult = await client.query(createGameQuery);

            // count the questions and update the total on the game row
            const setTotalQuestions = {
                text: 'UPDATE games SET total_questions = (SELECT count(id) FROM game_questions WHERE game_questions.game_id = $1) WHERE games.id = $1',
                values: [gameResult.rows[0].id]
            }

            await client.query(setTotalQuestions)
            await client.query('COMMIT')
            return gameResult;
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }


    }


    public gameStatusByAccessCode(code: string): Promise<QueryResult> {
        const query = {
            text: 'SELECT status FROM games WHERE access_code = $1',
            values: [code]
        }
        return this.pool.query(query);
    }

    /**
     * Call this method when a player is joining a game for the first time only.
     *
     * Will throw error if a game_player already exists with the specified name, and
     * the same game.
     *
     * @param access_code game access code
     * @param name name the player is trying to join as
     * @param userId (optional) if user has id, pass it here to associate game player id with user id.
     *
     */
    public async join(access_code: string, name: string, userId?: number) {
        // start transaction
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN')
            let hostName: string;
            let isHost = false;

            // get game
            const getGameQuery = {
                text: 'SELECT id, deck_id, host_id, status, host_player_name, current_question_index, total_questions FROM games WHERE games.access_code = $1',
                values: [access_code]
            }
            const gameResult = await client.query(getGameQuery);
            const game = gameResult.rows[0];

            // Throw if access code invalid
            if (!game) {
                throw new Error('Game not found');
            }

            // Create game player using name and game id.
            const createPlayerQuery = {
                text: 'INSERT INTO game_players (game_id, player_name, user_id) VALUES ($1, $2, $3) RETURNING game_players.id',
                values: [game.id, name, userId]
            }
            const createPlayerResult = await client.query(createPlayerQuery);
            hostName = game.host_player_name;

            // if user is host, set host name to new player name.
            // Game is created before host technically joins it.
            // This is an unfortunate side effect of name choice being put
            // AFTER game creation in the design.
            if (userId && (userId === game.host_id) && (name !== game.host_player_name)) {
                const updateGameHostQuery = {
                    text: `UPDATE games SET host_player_name = $1 WHERE games.id = $2`,
                    values: [name, game.id]
                }
                await client.query(updateGameHostQuery);
                hostName = name;
                isHost = true;
            }

            // get list of other players
            const getPlayerListQuery = {
                text: `SELECT id, player_name FROM game_players WHERE game_players.game_id = $1`,
                values: [game.id]
            }
            const playersResult = await client.query(getPlayerListQuery);

            // get deck info
            const getDeckQuery = {
                text: 'SELECT id, name, movie_rating, sfw, description, sort_order, clean, age_rating, status, thumbnail_url, purchase_price FROM decks WHERE id = $1',
                values: [game.deck_id]
            }
            const deckResult = await client.query(getDeckQuery);
            await client.query('COMMIT')

            return {
                status: game.status as GameStatus,
                game_id: game.id,
                deck: deckResult.rows[0],
                currentQuestionIndex: game.current_question_index,
                currentHostName: hostName,
                access_code,
                isHost,
                players: playersResult.rows,
                playerId: createPlayerResult.rows[0].id,
                playerName: name,
                totalQuestions: game.total_questions
            }
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    }

    // public getScoreboard(gameId: number) { }
}

export default Games;