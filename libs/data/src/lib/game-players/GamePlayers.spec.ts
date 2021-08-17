import { Pool, DatabaseError } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { setupGame } from '../util/testDependencySetup';
import { cleanDb } from '../util/cleanDb';
import TEST_GAME_PLAYERS from '../test-objects/gamePlayers';
import GamePlayers from './GamePlayers';

describe('GamePlayers dao', () => {
    let pool: Pool;
    let players: GamePlayers;
    let game_id: number;
    let deck_id: number;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        players = new GamePlayers(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
        [game_id, deck_id] = await setupGame(pool);
    })

    afterAll(() => {
        pool.end();
    })

    describe('insertOne', () => {

        it('should return player name and id if successful', async () => {
            const player = TEST_GAME_PLAYERS[0]
            const { rows } = await players.insertOne({ ...player, game_id });
            expect(rows[0].player_name).toEqual(player.player_name);
            expect(rows[0].id).toBeDefined();
        })

        it('should should throw if game not found', async () => {
            const player = TEST_GAME_PLAYERS[0]
            game_id += 1; // shouldn't exist
            try {
                await players.insertOne({ ...player, game_id })
            } catch (e) {
                const expected = new DatabaseError('insert or update on table "game_players" violates foreign key constraint "game_players_game_id_fkey"', 1, 'error');
                expect(e).toEqual(expected)
            }
        })
        // it('should throw if player name already taken for game', async () => {})

    })

    // describe('setHost', () => {})
})