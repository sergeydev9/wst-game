import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '../util/testDbConnection';
import { cleanDb } from '../util/cleanDb';
import { setupGame, setupGamePlayer, setupQuestion } from '../util/testDependencySetup';
import TEST_GAME_PLAYERS from '../test-objects/gamePlayers';
import Games from './Games.dao';
import Questions from '../questions/Questions.dao';
import GamePlayers from '../game-players/GamePlayers.dao';

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