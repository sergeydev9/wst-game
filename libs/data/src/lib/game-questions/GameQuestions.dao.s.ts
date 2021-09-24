// import { Pool } from 'pg';
// import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
// import { setupGame } from '../util/testDependencySetup';
// import { cleanDb } from '../util/cleanDb';
// import GameQuestions from './GameQuestions';
// import Questions from '../questions/Questions.dao';
// import { testQuestions } from '../util/testEntityGenerators';

// describe('GameQuesetions', () => {
//     let pool: Pool;
//     let gameQuestions: GameQuestions;
//     let questions: Questions;
//     let game_id: number;
//     let deck_id: number;

//     beforeAll(async () => {
//         pool = new Pool(TEST_DB_CONNECTION);
//         questions = new Questions(pool);
//         gameQuestions = new GameQuestions(pool);
//     })

//     beforeEach(async () => {
//         await cleanDb(pool);
//         [game_id, deck_id] = await setupGame(pool);

//         // insert 5 questions belonging to the game deck before every test
//         for (const question of testQuestions(5, deck_id)) {
//             await questions.insertOne({ ...question })
//         }
//     })

//     afterAll(() => {
//         pool.end();
//     })

//     describe('generate', () => {

//         it('should generate the correct number of game_questions', async () => {
//             const { rows } = await gameQuestions.generate(game_id, 5);
//             expect(rows.length).toEqual(5)
//         })
//         it('should generate maxiumum number of questions if input is higher than total number of active questions', async () => {
//             const { rows } = await gameQuestions.generate(game_id, 6);
//             expect(rows.length).toEqual(5)
//         })

//         it('should generate maxiumum number of questions if input is undefined', async () => {
//             const { rows } = await gameQuestions.generate(game_id);
//             expect(rows.length).toEqual(5)
//         })
//     })
// })