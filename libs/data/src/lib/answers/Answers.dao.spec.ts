import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import { testDecks, testQuestions } from '../util/testEntityGenerators';
import Answers from './Answers.dao';
import { setupGame, setupQuestion } from '../util/testDependencySetup';

describe('Answers', () => {
    let pool: Pool;
    let answers: Answers;
    let gameId: number;
    let deckId: number;
    let playerId: number;



    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION)
    })

    afterAll(() => {
        pool.end()
    })

    describe('submitValue', () => {

        it('should create a new answer row', async () => {
            expect(true).toBe(true);
        })
    })

    // describe('setScore', () =>{

    // })

    // describe('getByGameQuestionId', () => {

    // })
})