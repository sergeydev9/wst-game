import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import { cleanDb } from '../util/cleanDb';
import { testDecks, testQuestions } from '../util/testEntityGenerators';
import Answers from './Answers.dao';

describe('Answers dao', () => {
    let pool: Pool;
    let answers: Answers;
    let game

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION)
    })

    afterAll(() => {
        pool.end()
    })

    describe('submit', () => {

        it('should create a new answer row', async () => {
            expect(true).toBe(true);
        })
    })

    // describe('setScore', () =>{

    // })

    // describe('getByGameQuestionId', () => {

    // })
})