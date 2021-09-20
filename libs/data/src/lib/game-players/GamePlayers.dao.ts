import {Pool, QueryResult} from 'pg';
import Dao from '../base.dao';
import { IInsertGamePlayer } from '@whosaidtrue/app-interfaces';


class GamePlayers extends Dao {
    constructor(pool: Pool) {
        super(pool, 'game_players')
    }

    /**
     * Insert new Player. Returns player id and player_name if success.
     *
     * @throws DatabaseError
     * if:
     *  - Player name is not available
     *  - Bad game_id
     *
     * @param {IInsertGamePlayer} player
     * @return {{id, player_name}}  {Promise<QueryResult>}
     * @memberof GamePlayers
     */
    public insertOne(player: IInsertGamePlayer): Promise<QueryResult> {
        const { player_name, game_id } = player;
        const query = {
            text: `INSERT INTO game_players (player_name, game_id) VALUES ($1, $2) RETURNING id, player_name`,
            values: [player_name, game_id]
        }

        return this.pool.query(query);
    }

    public getPlayerByGameIdAndUserId(gameId: number, userId: number): Promise<QueryResult> {
        const query = {
            text: `SELECT * FROM game_players WHERE game_id = $1 and user_id = $2`,
            values: [gameId, userId]
        }

        return this.pool.query(query);
    }
}

export default GamePlayers