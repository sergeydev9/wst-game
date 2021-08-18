/**
 * Functions that set up the set of rows that different objects depend on.
 * Used to clean up repetitive and lengthy test setup code.
 */

import { Pool } from "pg";
import Decks from '../decks/Decks.dao';
import TEST_DECKS from '../test-objects/decks';
import Questions from '../questions/Questions.dao';
import TEST_QUESTIONS from '../test-objects/questions';
import { testQuestions } from "./testEntityGenerators";
import Games from '../games/Games.dao';
import TEST_GAMES from '../test-objects/games';

/**
 * Insert a deck
 *
 * @export
 * @param {Pool} pool
 * @return {number} id
 */
export async function setupDeck(pool: Pool) {
    const decks = new Decks(pool)

    // insert deck
    const deckResult = await decks.insertOne({ ...TEST_DECKS[0] })
    return deckResult.rows[0].id
}

/**
 * Insert a deck, then insert a game for the deck.
 *
 * @export
 * @param {Pool} pool
 * @return {*}
 */
export async function setupGame(pool: Pool) {
    const games = new Games(pool)

    const deck_id = await setupDeck(pool)

    // insert game
    const gameResult = await games.insertOne({ ...TEST_GAMES[0], deck_id })
    const game_id = gameResult.rows[0].id

    return [game_id, deck_id]
}

/**
 * Insert a deck, and assign the specified number of questions to it.
 *
 * @export
 * @param {Pool} pool
 * @param {number} [numQuestions=1]
 * @return {*}
 */
export async function setupQuestion(pool: Pool, numQuestions = 1) {
    const questions = new Questions(pool)

    const question_ids = []

    // create a deck
    const deck_id = await setupDeck(pool)

    // create set of qestions using deck id
    for (const question of testQuestions(numQuestions, deck_id)) {
        const { rows } = await questions.insertOne({ ...question })

        // push question ids to result array
        question_ids.push(rows[0].id)
    }

    return { deck_id, question_ids }
}

//TODO: Finish or delete?
export async function setupAnswer(pool: Pool) {
    const questions = new Questions(pool)

    const [game_id, deck_id] = await setupGame(pool)

    // insert question
    const questionResult = await questions.insertOne({ ...TEST_QUESTIONS[0], deck_id })

    // insert game_player
    // insert game_question
}