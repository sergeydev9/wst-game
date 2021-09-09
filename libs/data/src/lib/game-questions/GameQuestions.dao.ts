import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';

class GameQuestions extends Dao {
    constructor(pool: Pool) {
        super(pool, 'game_questions')
    }

    public generate(gameId: number, numQuestions?: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT * from generate_game_questions($1, $2)',
            values: [gameId, numQuestions]
        }

        return this.pool.query(query);
    }

    // TODO: FINISH
    // public async getByIndex(gameId, index): Promise<QueryResult>{

    // }
}

export default GameQuestions