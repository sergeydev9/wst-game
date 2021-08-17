import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import { testDecks } from '../util/testEntityGenerators';
import Games from './Games.dao';
import Questions from '../questions/Questions.dao';
import Decks from '../decks/Decks.dao';

describe('Games dao', () => {
    let pool: Pool;
    let games: Games;
    let questions: Questions;
    let decks: Decks;
    let gameId: number;
    let deckId: number;
    const accessCode = 'ABCDE'

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        games = new Games(pool);
        questions = new Questions(pool);
        decks = new Decks(pool);
    })

    beforeEach(async () => {
        await cleanDb(pool);

        for (const testDeck of testDecks(1, 'games')) {
            const deckResp = await decks.insertOne(testDeck);
            deckId = deckResp.rows[0].id;
        }

        // Insert initial game
        const query = {
            text: 'INSERT INTO games (access_code, status, deck_id) VALUES ($1, $2, $3) RETURNING id',
            values: [accessCode, 'initialized', deckId]
        }
        const { rows } = await games.pool.query(query);
        gameId = rows[0].id;
    })

    afterAll(() => {
        pool.end()
    })



    describe('getByAccessCode', () => {

        it('should return a game  object if game exists', async () => {
            const { rows } = await games.getByAccessCode(accessCode)
            expect(rows.length).toEqual(1)
        })

        it("should return an empty array if game doesn't exist", async () => {
            const { rows } = await games.getByAccessCode('wrong');
            expect(rows.length).toEqual(0)
        })
    })

    describe('getQuestions', () => {

        // beforeEach(async () => {
        //     // insert 3 game questions and add them to the game
        //     const questions = {
        //         text: 'INSERT INTO questions (text, text_for_guess'
        //     }
        // })

        // it('should return 3 game questions', async () => {
        //     const { rows } = await games.getQuestions(gameId);
        //     expect(rows.length).toEqual(3);
        // })

    })

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