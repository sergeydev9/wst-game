import { Pool, QueryResult } from 'pg';
import format from 'pg-format';
import { Deck, GameStatus, InsertGame, JoinGameResult, PlayerRef, StartGameResult } from '@whosaidtrue/app-interfaces';
import Dao from '../base.dao';

class Games extends Dao {
    constructor(pool: Pool) {
        super(pool, 'games');
    }

    public insertOne(game: InsertGame): Promise<QueryResult> {
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
    public async join(access_code: string, name: string, userId?: number): Promise<JoinGameResult> {
        // start transaction
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN')
            let hostName: string;
            let isHost = false;

            // get game
            const getGameQuery = {
                text: `
                SELECT
                    id,
                    deck_id,
                    host_id,
                    status,
                    host_player_name,
                    current_question_index,
                    total_questions
                FROM games
                WHERE games.access_code = $1`,
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
            if (userId && (userId === game.host_id) && (name !== game.host_player_name)) {
                const updateGameHostQuery = {
                    text: `UPDATE games SET host_player_name = $1 WHERE games.id = $2`,
                    values: [name, game.id]
                }
                await client.query(updateGameHostQuery);
                hostName = name;
                isHost = true;
            }

            // get deck info
            const getDeckQuery = {
                text: `
                SELECT
                    id,
                    name,
                    movie_rating,
                    sfw,
                    description,
                    sort_order,
                    clean,
                    age_rating,
                    status,
                    thumbnail_url,
                    purchase_price
                FROM decks
                WHERE id = $1`,
                values: [game.deck_id]
            }
            const deckResult = await client.query(getDeckQuery);
            await client.query('COMMIT')

            return {
                status: game.status as GameStatus,
                gameId: game.id,
                deck: deckResult.rows[0] as Deck,
                currentQuestionIndex: game.current_question_index,
                hostName,
                access_code,
                isHost,
                playerId: createPlayerResult.rows[0].id,
                playerName: name as string,
                totalQuestions: game.total_questions
            }
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    }

    /**
     * Called when the host starts the game.
     *
     * Sets the game status to "inProgress", and fetches the first
     * question for the game. The question is randomly selected from
     * questions with a null sequence index value.
     *
     * While fetching the question, adds reader data, and saves the number
     * of connected players at the start of the question. This number is used
     * to calculate scores.
     *
     * @param gameId
     * @param numberOfPlayersSnapshot number of players connected at start of game
     * @param readerId
     * @param readerName
     * @param startDate new start date for the game
     */
    public async start(
        gameId: number,
        playerNumberSnapshot: number,
        readerId: number,
        readerName: string,
        startDate: Date
    ): Promise<StartGameResult> {
        // start transaction
        const client = await this.pool.connect();

        try {
            const gameQuery = `
                UPDATE games
                SET status = 'inProgress', start_date = $1
                WHERE id = $2
                RETURNING status, start_date;
            `

            // update game
            const gameResult = await client.query({
                text: gameQuery,
                values: [startDate.toISOString(), gameId]
            })

            const gameRow = gameResult.rows[0];

            // throw if no game data
            if (!gameRow) throw new Error(`[start game] game update failed. gameId: ${gameId}`)

            // update game_question
            const gameQuestionUpdate = `
                UPDATE game_questions
                SET
                    reader_id = $1,
                    reader_name = $2,
                    question_sequence_index = 1,
                    player_number_snapshot = $3
                WHERE id = (
                    SELECT id
                    FROM game_questions
                    WHERE game_id = $4
                    AND question_sequence_index IS NULL
                    LIMIT 1
                    )
                RETURNING id, reader_id, reader_name, question_sequence_index, player_number_snapshot, question_id;
            `

            const gqUpdateResult = await client.query({
                text: gameQuestionUpdate,
                values: [readerId, readerName, playerNumberSnapshot, gameId]
            });

            const gameQuestion = gqUpdateResult.rows[0];

            // throw if no game_question data
            if (!gameQuestion) throw new Error(
                `[start game] Game question update failed.
                game id: ${gameId},
                reader id: ${readerId},
                reader name: ${readerName},
                number snapshot: ${playerNumberSnapshot}`
            );

            // get question text
            const getQuestionQuery = 'SELECT * FROM questions WHERE id = $1';

            const questionResult = await client.query({
                text: getQuestionQuery,
                values: [gameQuestion.question_id]
            })

            const questionRow = questionResult.rows[0];

            // throw if no question data
            if (!questionRow) throw new Error(`Question not found. question id: ${gameQuestion.question_id}`)

            return {
                game: {
                    status: gameRow.status,
                    startDate: new Date(gameRow.start_date)
                },
                question: {
                    questionId: questionRow.id,
                    gameQuestionId: gameQuestion.id,
                    numPlayers: gameQuestion.player_number_snapshot,
                    sequenceIndex: gameQuestion.question_sequence_index,
                    readerId: gameQuestion.reader_id,
                    readerName: gameQuestion.reader_name,
                    text: questionRow.text,
                    textForGuess: questionRow.text_for_guess,
                    followUp: questionRow.follow_up
                }
            }
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }

    }
}

export default Games;