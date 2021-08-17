import { Pool, QueryResult } from 'pg';
import { Game } from '../interfaces'
import Dao from '../base.dao';

class Games extends Dao {
    constructor(pool: Pool) {
        super(pool, 'games');
    }

    // public async insertOne(game: Partial<Game>): Promise<QueryResult> {
    //     const query = {

    //     }
    // }

    // public async getByAccessCode(code: string) {}

    // public async setStatus(gameId: number, status: string) { }

    // public async getScoreboard(gameId: number) { }
}

export default Games;