import { Pool, QueryResult } from 'pg';
import { IInsertGame } from '@whosaidtrue/app-interfaces';
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
     * Set start_date for game.
     *
     * Returns id and start_date of game.
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

    // public create(): Promise<QueryResult> {}

    // public gameStateById(gameId: number): Promise<QueryResult> {}

    // public gameStateByAccessCode(code: string): Promise<QueryResult> {}

    // public getScoreboard(gameId: number) { }
}

export default Games;