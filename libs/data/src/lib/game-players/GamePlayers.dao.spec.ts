import { Pool, DatabaseError } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { setupGame } from '../util/testDependencySetup';
import { cleanDb } from '../util/cleanDb';
import TEST_GAME_PLAYERS from '../test-objects/gamePlayers';
import TEST_GAMES from '../test-objects/games';
import GamePlayers from './GamePlayers.dao';
import Games from '../games/Games.dao';

describe('GamePlayers', () => {
    let pool: Pool;
    let players: GamePlayers;
    let game_id: number;
    let deck_id: number
    let games: Games;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        players = new GamePlayers(pool);
        games = new Games(pool);
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

        it('should throw if game not found', async () => {
            const player = TEST_GAME_PLAYERS[0]
            game_id += 1; // shouldn't exist
            try {
                await players.insertOne({ ...player, game_id })
                fail()
            } catch (e) {
                const expected = new DatabaseError('insert or update on table "game_players" violates foreign key constraint "game_players_game_id_fkey"', 1, 'error');
                expect(e).toEqual(expected)
            }
        })
        it('should throw if player name already taken for game', async () => {
            const player = TEST_GAME_PLAYERS[0];
            await players.insertOne({ ...player, game_id })

            try {
                await players.insertOne({ ...player, game_id })
                fail()
            } catch (e) {
                const expected = new DatabaseError('duplicate key value violates unique constraint "game_players_game_id_player_name_unique_index"', 1, 'error');
                expect(e).toEqual(expected)
            }
        })

        it('should throw if names differ only in case', async () => {
            const player = TEST_GAME_PLAYERS[0];
            await players.insertOne({ ...player, game_id })

            try {
                const { player_name } = player;
                await players.insertOne({ ...player, game_id, player_name: player_name.toUpperCase() })
                fail()
            } catch (e) {
                const expected = new DatabaseError('duplicate key value violates unique constraint "game_players_game_id_player_name_unique_index"', 1, 'error');
                expect(e).toEqual(expected)
            }
        })

        it('should succeed if same name, different game', async () => {
            // create a second game
            const access_code = '123456'
            const gameResult = await games.insertOne({ ...TEST_GAMES[0], deck_id, access_code });


            // insert first player
            const player = TEST_GAME_PLAYERS[0];
            const result1 = await players.insertOne({ ...player, game_id });

            // insert second player into second game, using the same name
            game_id = gameResult.rows[0].id;
            const { rows } = await players.insertOne({ ...player, game_id });
            expect(rows[0].id).not.toEqual(result1.rows[0].id);
        })

    })

})