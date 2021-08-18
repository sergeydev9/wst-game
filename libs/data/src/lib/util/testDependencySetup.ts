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
import GamePlayers from "../game-players/GamePlayers";
import TEST_GAME_PLAYERS from '../test-objects/gamePlayers';

const random = () => (Math.random() + 1).toString(36).substring(7); // prevent name collisions
/**
 * Insert a deck
 *
 * @export
 * @param {Pool} pool
 * @return {number} id
 */
export async function setupDeck(pool: Pool) {
    const decks = new Decks(pool)

    const name = `${TEST_DECKS[0].name} - ${random()}`

    // insert deck
    const deckResult = await decks.insertOne({ ...TEST_DECKS[0], name })
    return deckResult.rows[0].id
}

/**
 * Insert a deck, then insert a game for the deck.
 *
 * @export
 * @param {Pool} pool
 * @param {string} accessCode set game access_code column. If undefined, will be random
 * @return {[number, number]} game id, deck id
 */
export async function setupGame(pool: Pool, accessCode?: string) {
    const games = new Games(pool)
    const deck_id = await setupDeck(pool)

    // if access code defined, use that, else generate random code
    const access_code = accessCode ? accessCode : random();

    // insert game
    const gameResult = await games.insertOne({ ...TEST_GAMES[0], deck_id, access_code })
    const game_id = gameResult.rows[0].id

    return [game_id, deck_id]
}

/**
 * Insert a deck, and assign the specified number of questions to it.
 *
 * @export
 * @param {Pool} pool
 * @param {number} [numQuestions=1]
 * @return {{deck_id: number, question_ids: number[]}}
 */
export async function setupQuestion(pool: Pool, numQuestions = 1, deckId?: number): Promise<{ deck_id: number, question_ids: number[] }> {
    const questions = new Questions(pool);
    let deck_id: number;
    const question_ids = []

    // if no deckId input, generate one.
    if (!deckId) {
        deck_id = await setupDeck(pool)
    } else {
        deck_id = deckId;
    }

    // create set of qestions using deck id
    for (const question of testQuestions(numQuestions, deck_id)) {
        const { rows } = await questions.insertOne({ ...question })

        // push question ids to result array
        question_ids.push(rows[0].id)
    }

    return { deck_id, question_ids }
}

export async function setupGamePlayer(pool: Pool): Promise<[number, number, number]> {
    const players = new GamePlayers(pool);
    // create a game
    const [game_id, deck_id] = await setupGame(pool);

    // create a game player associated with game.
    const player_name = `${TEST_GAME_PLAYERS[0].player_name} - ${random()}`
    const { rows } = await players.insertOne({ ...TEST_GAME_PLAYERS[0], game_id, player_name });
    const player_id = rows[0].id;

    // return player id, game id, and deck id.
    return [player_id, game_id, deck_id];
}

//TODO: Finish
export async function setupAnswer(pool: Pool) {
    const questions = new Questions(pool)

    const [game_id, deck_id] = await setupGame(pool)

    // insert question
    const questionResult = await questions.insertOne({ ...TEST_QUESTIONS[0], deck_id })

    // insert game_player
    // insert game_question
}