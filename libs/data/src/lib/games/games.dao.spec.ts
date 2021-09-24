import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import { setupGame, setupGamePlayer, setupOneDeck, setupQuestion } from '../util/testDependencySetup';
import TEST_GAME_PLAYERS from '../test-objects/gamePlayers';
import Games from './Games.dao';
import Questions from '../questions/Questions.dao';
import GamePlayers from '../game-players/GamePlayers.dao';
import Users from '../users/Users.dao';

describe('Games', () => {
    let pool: Pool;
    let games: Games;
    let users: Users;
    let players: GamePlayers;
    let userId: number;
    let deckId: number;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        games = new Games(pool);
        players = new GamePlayers(pool);
        users = new Users(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
        // save a deck, some questions, and a user.
        deckId = await setupOneDeck(pool);
        await setupQuestion(pool, 9, deckId)
        const userResult = await users.register('email@test.com', 'password123')
        userId = userResult.rows[0].id;


    })

    afterAll(() => {
        pool.end()
    })

    describe('hooks', () => {
        it('should run without errors', async () => {
            return;
        })
    })

    describe('create', () => {

        it('should insert a new game row', async () => {
            const { rows } = await games.create(userId, deckId);

            expect(rows.length).toEqual(1);
            expect(rows[0].id).toBeDefined()
            expect(rows[0].access_code).toBeDefined()
        })

        it('should create 9 game_questions for the game', async () => {
            const gameRes = await games.create(userId, deckId);

            const getQuesetions = {
                text: 'SELECT * FROM game_questions WHERE game_questions.game_id = $1',
                values: [gameRes.rows[0].id]
            }

            const { rows } = await pool.query(getQuesetions);
            expect(rows.length).toEqual(9)
        })

        it('should have 9 in total_questions column', async () => {
            const gameRes = await games.create(userId, deckId);
            const { rows } = await games.getById(gameRes.rows[0].id)
            expect(rows[0].total_questions).toEqual(9)
        })
    })

    describe('getByAccessCode', () => {

        it('should return a game  object if game exists', async () => {
            const gameRes = await games.create(userId, deckId);

            const { rows } = await games.getByAccessCode(gameRes.rows[0].access_code)
            expect(rows.length).toEqual(1)
        })

        it("should return an empty array if game doesn't exist", async () => {
            const { rows } = await games.getByAccessCode('wrong');
            expect(rows.length).toEqual(0)
        })
    })

    describe('setStartDate', () => {

        it('should set the end date of a game', async () => {
            const gameRes = await games.create(userId, deckId);
            const date = new Date();
            const { rows } = await games.setStartDate(gameRes.rows[0].id, date);

            // game should have start_date equal to input
            expect(rows[0].start_date).toEqual(date);
        })
    })

    describe('setEndDate', () => {

        it('should set the end date of a game', async () => {
            const gameRes = await games.create(userId, deckId);
            const date = new Date();
            const { rows } = await games.setEndDate(gameRes.rows[0].id, date);

            // game should have end_date equal to input
            expect(rows[0].end_date).toEqual(date);
        })
    })

    describe('gameStatusByAccessCode', () => {

        it("should return status'lobby ", async () => {
            const gameRes = await games.create(userId, deckId);

            const { rows } = await games.gameStatusByAccessCode(gameRes.rows[0].access_code);

            expect(rows[0].status).toEqual('lobby')
        })
    })

    describe('join', () => {

        it('should return complete game state with player id and player name, and the new host name correctly set', async () => {
            const gameRes = await games.create(userId, deckId);
            const actual = await games.join(gameRes.rows[0].access_code, 'Test Name', userId)

            expect(actual.status).toEqual('lobby');
            expect(actual.isHost).toEqual(true);
            expect(actual.deck).toBeDefined();
            expect(actual.gameId).toBeDefined();
            expect(actual.players.length).toEqual(1);
            expect(actual.access_code).toEqual(gameRes.rows[0].access_code);
            expect(actual.currentHostName).toEqual('Test Name');
            expect(actual.currentQuestionIndex).toEqual(1);
            expect(actual.totalQuestions).toEqual(9);
            expect(actual.playerId).toBeDefined();
        })

        it('should throw if access code is wrong', async () => {
            await games.create(userId, deckId);

            try {
                await games.join('wrongcode', 'Test Name', userId)

            } catch (e) {
                expect(e).toEqual(new Error('Game not found'))
            }
        })

        it('should return complete game state with player id and player name, but no new host set if player not host', async () => {

            const userResult = await users.register('email2@test.com', 'password1323')
            const secondUserId = userResult.rows[0].id;
            const gameRes = await games.create(userId, deckId);
            const actual = await games.join(gameRes.rows[0].access_code, 'Test Name', secondUserId)

            expect(actual.status).toEqual('lobby');
            expect(actual.isHost).toEqual(false);
            expect(actual.deck).toBeDefined();
            expect(actual.gameId).toBeDefined();
            expect(actual.players.length).toEqual(1);
            expect(actual.access_code).toEqual(gameRes.rows[0].access_code);
            expect(actual.currentHostName).not.toEqual('Test Name');
            expect(actual.currentQuestionIndex).toEqual(1);
            expect(actual.totalQuestions).toEqual(9);
            expect(actual.playerId).toBeDefined();


        })

    })

    describe('startQuestion', () => {

        it('should update game.current_question_index', async () => {
            return; // TODO
        })

        it('should create a new game_answers row for all players', async () => {
            const userId2 = (await users.register('email3@test.com', 'password1323')).rows[0].id;

            const gameRes = await games.create(userId, deckId);
            const accessCode = gameRes.rows[0].access_code;
            const gameId = gameRes.rows[0].id;

            let q = `SELECT id FROM game_questions WHERE game_id = ${gameId} LIMIT 1`;
            const gameQuestionId = (await pool.query(q)).rows[0].id;

            const gamePlayer1 = await games.join(accessCode, 'Test Name 1', userId);
            const gamePlayer2 = await games.join(accessCode, 'Test Name 2', userId2);

            const actual = await games.startQuestion(gameId, gameQuestionId, [gamePlayer1.playerId, gamePlayer2.playerId]);
            expect(actual.rows[0].id).toBeDefined();
            expect(actual.rows[1].id).toBeDefined();

            q = `SELECT * FROM game_answers WHERE game_id = ${gameId} AND game_question_id = ${gameQuestionId}`;
            const answers = await pool.query(q);
            expect(answers.rows.length).toEqual(2);
        })
    })

    // describe('gameStateByPlayerId')

    // describe('setStatus')

    // describe('getScoreboard')

    // describe('getHost')

    // describe('getPlayers')
})