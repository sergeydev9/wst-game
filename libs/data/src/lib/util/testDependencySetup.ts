/**
 * Functions that set up the set of rows that different objects depend on.
 * Used to clean up repetitive and lengthy test setup code.
 */

import { Pool } from "pg";
import Decks from '../decks/Decks.dao';
import TEST_DECKS from '../test-objects/decks';
import Questions from '../questions/Questions.dao';
import TEST_QUESTIONS from '../test-objects/questions';
import Games from '../games/Games.dao';
import TEST_GAMES from '../test-objects/games';

export async function setupGame(pool: Pool) {
    const decks = new Decks(pool);
    const games = new Games(pool);

    // insert deck
    const deckResult = await decks.insertOne({ ...TEST_DECKS[0] });
    const deck_id = deckResult.rows[0].id;

    // insert game
    const gameResult = await games.insertOne({ ...TEST_GAMES[0], deck_id });
    const game_id = gameResult.rows[0].id;

    return [game_id, deck_id];
}

export async function setupAnswer(pool: Pool) {
    const questions = new Questions(pool);

    const [game_id, deck_id] = await setupGame(pool);

    // insert question
    const questionResult = await questions.insertOne({ ...TEST_QUESTIONS[0], deck_id })

    // insert game_player
    // insert game_question
}