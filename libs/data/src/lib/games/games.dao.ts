import { Pool, QueryResult } from 'pg';
import { Game } from '../interfaces'
import Dao from '../base.dao';

class Games extends Dao {
    constructor(pool: Pool) {
        super(pool, 'games');
    }

    // public async create(): Promise<QueryResult> {
    //     const query = {

    //     }
    // }

    public async getByAccessCode(code: string): Promise<QueryResult> {
        const query = {
            text: 'SELECT * FROM games WHERE access_code = $1',
            values: [code]
        }
        return this.pool.query(query);
    }

    public async setStatus(gameId: number, status: string): Promise<QueryResult> {
        const query = {
            text: 'UPDATE games SET status = $2 WHERE id = $1',
            values: [gameId, status]
        }
        return this.pool.query(query)
    }

    /**
     * Get all the game_questions for the game.
     *
     * @param {number} gameId
     * @return {Promise<QueryResult>}
     * @memberof Games
     */
    public async getQuestions(gameId: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from game_questions WHERE game_questions.game_id = $1 ORDER BY game_questions.question_sequence_index',
            values: [gameId]
        }
        return this.pool.query(query)
    }
    // public async gameStateById(gameId: number): Promise<QueryResult> {}

    // public async gameStateByAccessCode(code: string): Promise<QueryResult> {}

    // public async gameStateByPlayerId(playerId: number): Promise<QueryResult> {}

    // public async getScoreboard(gameId: number) { }
}

export default Games;