import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import { setupOneDeck, setupQuestion } from '../util/testDependencySetup';
import Games from './Games.dao';
import Users from '../users/Users.dao';

describe('Games', () => {
    let pool: Pool;
    let games: Games;
    let users: Users;
    let userId: number;
    let deckId: number;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        games = new Games(pool);
        users = new Users(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);
        // save a deck, some questions, and a user.
        deckId = await setupOneDeck(pool);
        await setupQuestion(pool, 9, deckId)
        const userResult = await users.register('email@test.com', 'password123', 'www.test.com')
        userId = userResult.rows[0].id;
    })

    afterAll(() => {
        pool.end()
    })

    describe('create', () => {

        it('should insert a new game row', async () => {
            const { rows } = await games.create(userId, deckId, 'www.test.com');

            expect(rows.length).toEqual(1);
            expect(rows[0].id).toBeDefined()
            expect(rows[0].access_code).toBeDefined()
        })

        it('should create 9 game_questions for the game', async () => {
            const gameRes = await games.create(userId, deckId, 'www.test.com');

            const getQuesetions = {
                text: 'SELECT * FROM game_questions WHERE game_questions.game_id = $1',
                values: [gameRes.rows[0].id]
            }

            const { rows } = await pool.query(getQuesetions);
            expect(rows.length).toEqual(9)
        })

        it('should have 9 in total_questions column', async () => {
            const gameRes = await games.create(userId, deckId, 'www.test.com');
            const { rows } = await games.getById(gameRes.rows[0].id)
            expect(rows[0].total_questions).toEqual(9)
        })
    })

    describe('getByAccessCode', () => {

        it('should return a game object if game exists', async () => {
            const gameRes = await games.create(userId, deckId, 'www.test.com');

            const { rows } = await games.getByAccessCode(gameRes.rows[0].access_code)
            expect(rows.length).toEqual(1)
        })

        it('should ignore access_code case', async () => {
            const gameRes = await games.create(userId, deckId, 'www.test.com');

            const { rows } = await games.getByAccessCode(gameRes.rows[0].access_code.toLowerCase());
            expect(rows.length).toEqual(1)
        })

        it("should return an empty array if game doesn't exist", async () => {
            const { rows } = await games.getByAccessCode('wrong');
            expect(rows.length).toEqual(0)
        })
    })

    describe('setEndDate', () => {

        it('should set the end date of a game', async () => {
            const gameRes = await games.create(userId, deckId, 'www.test.com');
            const date = new Date();
            const { rows } = await games.setEndDate(gameRes.rows[0].id, date);

            // game should have end_date equal to input
            expect(rows[0].end_date).toEqual(date);
        })
    })

    describe('gameStatusByAccessCode', () => {

        it("should return status'lobby ", async () => {
            const gameRes = await games.create(userId, deckId, 'www.test.com');

            const { rows } = await games.gameStatusByAccessCode(gameRes.rows[0].access_code);

            expect(rows[0].status).toEqual('lobby')
        })

        it("should ignore access_code case", async () => {
            const gameRes = await games.create(userId, deckId, 'www.test.com');

            const { rows } = await games.gameStatusByAccessCode(gameRes.rows[0].access_code.toLowerCase());

            expect(rows[0].status).toEqual('lobby')
        })
    })

    describe('join', () => {

        it('should return complete game state with player id and player name, and the new host name correctly set', async () => {
            const gameRes = await games.create(userId, deckId, 'www.test.com');
            const actual = await games.join(gameRes.rows[0].access_code, 'Test Name', userId)

            expect(actual.status).toEqual('lobby');
            expect(actual.isHost).toEqual(true);
            expect(actual.deck).toBeDefined();
            expect(actual.gameId).toBeDefined();
            expect(actual.access_code).toEqual(gameRes.rows[0].access_code);
            expect(actual.hostName).toEqual('Test Name');
            expect(actual.currentQuestionIndex).toEqual(1);
            expect(actual.totalQuestions).toEqual(9);
            expect(actual.playerId).toBeDefined();
        })

        it('should ignore access_code case and return uppercase', async () => {
            const gameRes = await games.create(userId, deckId, 'www.test.com');
            const actual = await games.join(gameRes.rows[0].access_code.toLowerCase(), 'Test Name', userId)

            expect(actual.access_code).toEqual(gameRes.rows[0].access_code.toUpperCase());
        })

        it('should throw if access code is wrong', async () => {
            await games.create(userId, deckId, 'www.test.com');

            try {
                await games.join('wrongcode', 'Test Name', userId)

            } catch (e) {
                expect(e).toEqual(new Error('Game not found'))
            }
        })

        it('should return complete game state with player id and player name, but no new host set if player not host', async () => {

            const userResult = await users.register('email2@test.com', 'password1323', 'www.test.com')
            const secondUserId = userResult.rows[0].id;
            const gameRes = await games.create(userId, deckId, 'www.test.com');
            const actual = await games.join(gameRes.rows[0].access_code, 'Test Name', secondUserId)

            expect(actual.status).toEqual('lobby');
            expect(actual.isHost).toEqual(false);
            expect(actual.deck).toBeDefined();
            expect(actual.gameId).toBeDefined();
            expect(actual.access_code).toEqual(gameRes.rows[0].access_code);
            expect(actual.hostName).not.toEqual('Test Name');
            expect(actual.currentQuestionIndex).toEqual(1);
            expect(actual.totalQuestions).toEqual(9);
            expect(actual.playerId).toBeDefined();
        })
    })

    describe('start', () => {
        let gameId: number;
        let playerId: number;
        const playerName = "Test Name";

        beforeEach(async () => {
            // create a game
            const { rows } = await games.create(userId, deckId, 'www.test.com');
            const game = rows[0];
            gameId = game.id;

            // join game as host
            const joinResult = await games.join(game.access_code, playerName, userId);
            playerId = joinResult.playerId;

        })

        it('should return updated game and question records', async () => {

            const startDate = new Date()
            const actual = await games.start(gameId, 1, playerId, playerName, startDate)

            const { question, game } = actual;

            expect(game.status).toEqual('inProgress');
            expect(game.startDate).toEqual(startDate)
            expect(question.questionId).toBeDefined();
            expect(question.gameQuestionId).toBeDefined();
            expect(question.numPlayers).toEqual(1);
            expect(question.sequenceIndex).toEqual(1);
            expect(question.readerId).toEqual(playerId);
            expect(question.readerName).toEqual(playerName);
            expect(question.followUp).toBeDefined();
            expect(question.text).toBeDefined();
            expect(question.textForGuess).toBeDefined();
            expect(question.globalTrue).toEqual(0)

        })
    })

    describe('end', () => {
        let gameId: number;
        let accessCode: string;

        beforeEach(async () => {
            // create a game
            const { rows } = await games.create(userId, deckId, 'www.test.com');
            const game = rows[0];
            gameId = game.id;
            accessCode = game.access_code;
        })

        it('access_code, access_code_ref, and status should all have correct values', async () => {

            await games.endGame(gameId);

            const { rows } = await games.getById(gameId);
            const actual = rows[0];

            expect(actual.access_code_ref).toEqual(accessCode);
            expect(actual.access_code).toBeNull();
            expect(actual.status).toEqual('finished')
        })

        it('access_code_ref should not be null if function called twice', async () => {

            await games.endGame(gameId);
            await games.endGame(gameId);

            const { rows } = await games.getById(gameId);
            const actual = rows[0];

            expect(actual.access_code_ref).toEqual(accessCode);
        })
    })

})