import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '../util/testDbConnection';
import { cleanDb } from '../util/cleanDb';
import { setupGame, setupGamePlayer, setupQuestion } from '../util/testDependencySetup';
import TEST_GAME_PLAYERS from '../test-objects/gamePlayers';
import Games from './Games.dao';
import Questions from '../questions/Questions.dao';
import GamePlayers from '../game-players/GamePlayers';

describe('Games', () => {
    let pool: Pool;
    let games: Games;
    let players: GamePlayers;
    let game_id: number;
    let deck_id: number;
    let player_id: number;
    const access_code = 'ABCDE'

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        games = new Games(pool);
        players = new GamePlayers(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
        [player_id, game_id, deck_id] = await setupGamePlayer(pool);
    })

    afterAll(() => {
        pool.end()
    })



    describe('getByAccessCode', () => {

        beforeEach(async () => {
            await setupGame(pool, access_code);
        })

        it('should return a game  object if game exists', async () => {
            const { rows } = await games.getByAccessCode(access_code)
            expect(rows.length).toEqual(1)
        })

        it("should return an empty array if game doesn't exist", async () => {
            const { rows } = await games.getByAccessCode('wrong');
            expect(rows.length).toEqual(0)
        })
    })

    describe('setHost', () => {

        it('should insert a new game_host record', async () => {
            const { rows } = await games.setHost(game_id, player_id);
            expect(rows[0].id).toBeDefined();
        })

        it('should delete the old host when a new one is created', async () => {
            // get host for game query
            const query = {
                text: 'SELECT * FROM game_hosts WHERE game_id = $1',
                values: [game_id]
            }

            // set initial player as host
            await games.setHost(game_id, player_id);
            const result1 = await pool.query(query);

            // initial player is only host
            expect(result1.rows.length).toEqual(1);
            expect(result1.rows[0].game_player_id).toEqual(player_id)

            // create second player and assign to same game
            const { rows } = await players.insertOne({ ...TEST_GAME_PLAYERS[1], game_id });
            const secondPlayer = rows[0]

            // set second player as host
            await games.setHost(game_id, secondPlayer.id);

            // get host for game
            const actual = await pool.query(query);

            // there is only 1 host, and it's the second player.
            expect(actual.rows.length).toEqual(1);
            expect(actual.rows[0].game_player_id).toEqual(secondPlayer.id)
        })
    })

    describe('getHost', () => {

        it('should retrieve correct host', async () => {
            // insert host
            const { rows } = await games.setHost(game_id, player_id);
            const hostId = rows[0].id;

            // get host
            const actual = await games.getHost(game_id);
            const host = actual.rows[0];

            // data from get host should match
            expect(host.id).toEqual(player_id);
            expect(host.player_name).toBeDefined();
        })

    })

    describe('setStartDate', () => {

        it('should set the end date of a game', async () => {
            const date = new Date();
            const { rows } = await games.setStartDate(game_id, date);

            // game should have start_date equal to input
            expect(rows[0].start_date).toEqual(date);
        })
    })

    describe('setEndDate', () => {

        it('should set the end date of a game', async () => {
            const date = new Date();
            const { rows } = await games.setEndDate(game_id, date);

            // game should have end_date equal to input
            expect(rows[0].end_date).toEqual(date);
        })
    })

    // TODO: finish implementation in DB
    // describe('getQuestions', () => {

    //     beforeEach(async () => {
    //         // insert 5 game questions and add them to the game
    //         await setupQuestion(pool, 5, deck_id);
    //     })

    //     it('should return 5 game questions', async () => {
    //         const { rows } = await games.getQuestions(game_id);
    //         expect(rows.length).toEqual(5);
    //     })

    // })

    // describe('create', () => {

    //     it('should insert a new game row', async () => {
    //         const { access_code, status } = TEST_GAMES[0];
    //         const { rows } = await games.insertOne({ access_code, status });
    //         expect(rows.length).toEqual(1);
    //     })
    // })

    // describe('gameStateById')

    // describe('gameStateByAccessCode')

    // describe('gameStateByPlayerId')

    // describe('setStatus')

    // describe('getScoreboard')

    // describe('getHost')

    // describe('getPlayers')
})