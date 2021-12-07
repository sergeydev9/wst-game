import { Pool, QueryResult } from 'pg';
import { logger } from '@whosaidtrue/logger';
import { getAndUpdateQuery } from '../game-questions/GameQuestions.dao';
import { getQuestionData } from '../questions/questions.dao';
import {
  Deck,
  GameStatus,
  InsertGame,
  JoinGameResult,
  StartGameResult,
} from '@whosaidtrue/app-interfaces';
import Dao from '../base.dao';

class Games extends Dao {
  constructor(pool: Pool) {
    super(pool, 'games');
  }

  public insertOne(game: InsertGame): Promise<QueryResult> {
    const { deck_id, status, access_code, domain } = game;
    const query = {
      text: `INSERT INTO games (
                deck_id,
                status,
                access_code,
                domain
            ) VALUES ($1, $2, UPPER($3), $4) RETURNING id`,
      values: [deck_id, status, access_code, domain],
    };

    return this.pool.query(query);
  }

  public getByAccessCode(code: string): Promise<QueryResult> {
    const query = {
      text: 'SELECT * FROM games WHERE UPPER(access_code) = UPPER($1)',
      values: [code],
    };
    return this.pool.query(query);
  }

  public setStatus(gameId: number, status: string): Promise<QueryResult> {
    const query = {
      text: 'UPDATE games SET status = $2 WHERE id = $1',
      values: [gameId, status],
    };
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
      values: [date.toISOString(), game_id],
    };

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
  public async create(
    userId: number,
    deckId: number,
    domain: string
  ): Promise<QueryResult> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const code = [];

      // I and O excluded per requirements
      const letters = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'J',
        'K',
        'L',
        'M',
        'N',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ];

      while (code.length < 4) {
        const index = Math.floor(Math.random() * 23);
        code.push(letters[index]);
      }

      // create the game and questions.
      const createGameQuery = {
        text: `
                    WITH d_questions AS ( --get all active questions for the deck
                        SELECT * FROM active_questions WHERE deck_id = $2 ORDER BY random()
                    ),
                    new_game AS ( --create new game
                        INSERT INTO games (access_code, access_code_ref, status, deck_id, host_id, domain)
                        VALUES (UPPER($4), UPPER($4), 'lobby', $2, $1, $3)
                        RETURNING games.id, games.access_code
                    ), ins AS (
                        INSERT INTO game_questions (game_id, question_id)
                        SELECT new_game.id, d_questions.id
                        FROM d_questions
                        CROSS JOIN new_game
                    )
                    SELECT * from new_game;`,
        name: 'createGame',
        values: [userId, deckId, domain, code.join('')],
      };
      const gameResult = await client.query(createGameQuery);

      if (!gameResult) {
        throw new Error('no game created');
      }
      // count the questions and update the total on the game row
      const setTotalQuestions = {
        text: `UPDATE games SET total_questions = (SELECT count(id) FROM game_questions WHERE game_questions.game_id = $1) WHERE games.id = $1`,
        values: [gameResult.rows[0].id],
      };
      await client.query(setTotalQuestions);
      await client.query('COMMIT');
      return gameResult;
    } catch (e) {
      logger.error(e);
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  public gameStatusByAccessCode(access_code: string): Promise<QueryResult> {
    const query = {
      text: 'SELECT status FROM games WHERE UPPER(access_code) = UPPER($1)',
      values: [access_code],
    };
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
  public async join(
    access_code: string,
    name: string,
    userId?: number
  ): Promise<JoinGameResult> {
    // start transaction
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
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
                WHERE UPPER(access_code) = UPPER($1)`,
        values: [access_code],
      };
      const gameResult = await client.query(getGameQuery);
      const game = gameResult.rows[0];

      // Throw if access code invalid
      if (!game) {
        throw new Error('Game not found');
      }

      // Create game player using name and game id.
      const createPlayerQuery = {
        text: 'INSERT INTO game_players (game_id, player_name, user_id) VALUES ($1, $2, $3) RETURNING game_players.id',
        values: [game.id, name, userId],
      };
      const createPlayerResult = await client.query(createPlayerQuery);
      hostName = game.host_player_name;

      // if user is host, set host name to new player name.
      if (userId && userId === game.host_id && name !== game.host_player_name) {
        const updateGameHostQuery = {
          text: `UPDATE games SET host_player_name = $1 WHERE games.id = $2`,
          values: [name, game.id],
        };
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
        values: [game.deck_id],
      };
      const deckResult = await client.query(getDeckQuery);
      await client.query('COMMIT');

      return {
        status: game.status as GameStatus,
        gameId: game.id,
        deck: deckResult.rows[0] as Deck,
        currentQuestionIndex: game.current_question_index,
        hostName,
        access_code: access_code.toUpperCase(),
        isHost,
        playerId: createPlayerResult.rows[0].id,
        playerName: name as string,
        totalQuestions: game.total_questions,
      };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
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
   * @param playerNumberSnapshot number of players connected at start of game
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
      await client.query('BEGIN');

      const gameQuery = `
                UPDATE games
                SET status = 'inProgress', start_date = $1
                WHERE id = $2
                RETURNING status, start_date;
            `;

      // update game
      const gameResult = await client.query({
        text: gameQuery,
        values: [startDate.toISOString(), gameId],
      });

      const gameRow = gameResult.rows[0];

      // throw if no game data
      if (!gameRow)
        throw new Error(`[start game] game update failed. gameId: ${gameId}`);

      const gqUpdateResult = await client.query(
        getAndUpdateQuery(gameId, readerId, readerName, playerNumberSnapshot)
      );
      const gameQuestion = gqUpdateResult.rows[0];

      // throw if no game_question data
      if (!gameQuestion)
        throw new Error(`[start game] Game question update failed.`);

      const questionResult = await client.query(
        getQuestionData(gameQuestion.question_id)
      );
      const questionRow = questionResult.rows[0];

      // throw if no question data
      if (!questionRow)
        throw new Error(
          `Question not found. question id: ${gameQuestion.question_id}`
        );

      await client.query('COMMIT');

      return {
        game: {
          status: gameRow.status,
          startDate: new Date(gameRow.start_date),
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
          followUp: questionRow.follow_up,
          category: questionRow.category,
          globalTrue: Math.round(questionRow.global_true) || 0,
        },
      };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Set game status to finished, and end time to now.
   *
   * Also sets access_code_ref to the old value of the access_code
   * @param gameId
   * @returns
   */
  public async endGame(gameId: number): Promise<QueryResult> {
    const query = {
      text: `
                UPDATE games
                SET end_date = $1, status = 'finished', access_code = NULL
                WHERE id = $2`,
      values: [new Date().toISOString(), gameId],
    };

    return this.pool.query(query);
  }

  /**
   * End a game if host.
   *
   * This query is used by the '/end' endpoint. The user Id parameter is added
   * to prevent users from being able to end arbitrary games through the endpoint.
   */
  public endGameIfHost(gameId: number, userId: number): Promise<QueryResult> {
    const query = {
      text: `
                UPDATE games
                SET end_date = $1, status = 'finished'
                WHERE id = $2
                AND host_id = $3`,
      values: [new Date().toISOString(), gameId, userId],
    };

    return this.pool.query(query);
  }
}

export default Games;
