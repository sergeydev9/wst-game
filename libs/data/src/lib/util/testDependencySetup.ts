/**
 * Functions that set up the set of rows that different objects depend on.
 * Used to clean up repetitive and lengthy test setup code.
 */

import { Pool } from "pg";
import format from 'pg-format';
import Decks from '../decks/Decks.dao';
import TEST_DECKS from '../test-objects/Decks';
import Questions from '../questions/Questions.dao';
import TEST_QUESTIONS from '../test-objects/Questions';
import { testQuestions, testDecks } from "./testEntityGenerators";
import Games from '../games/Games.dao';
import TEST_GAMES from '../test-objects/games';
import GamePlayers from "../game-players/GamePlayers.dao";
import TEST_GAME_PLAYERS from '../test-objects/gamePlayers';
import Users from '../users/Users.dao';

const random = () => (Math.random() + 1).toString(36).substring(7); // prevent name collisions
/**
 * Insert a deck
 *
 * @export
 * @param {Pool} pool
 * @return {number} id
 */
export async function setupOneDeck(pool: Pool) {
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
    const deck_id = await setupOneDeck(pool)

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
        deckId = await setupOneDeck(pool)
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

export async function setupDecks(pool: Pool, totalDecks: number, numRating?: number, ageRating?: number) {
    const deckIds = [];

    // save totalDecks number of decks in DB
    const decks = []
    let count = 0

    for (const [index, deck] of [...testDecks(totalDecks)].entries()) {
        let { age_rating } = deck;
        const { name, sort_order, sfw, movie_rating, purchase_price, status, description, clean } = deck;

        // set numRating decks to have ageRating
        // only set for even indexed decks so that higher rating decks
        // aren't clusetered at the start
        if (count < numRating && index % 2 === 0) {
            age_rating = ageRating;
            count++
        }

        decks.push([name, sort_order, sfw, age_rating, movie_rating, purchase_price, status, description, clean]);
    }

    const deckQuery = {
        text: format('INSERT INTO decks (name, sort_order, sfw, age_rating, movie_rating, purchase_price, status, description, clean ) VALUES %L RETURNING id', decks),
    }

    // store ids of saved decks
    const result = await pool.query(deckQuery);
    result.rows.forEach(row => deckIds.push(row.id))

    return deckIds
}

export async function setupUserDecks(pool: Pool, totalDecks: number, ownedDecks: number, ageRating = 0, numRating = 0) {
    // save user
    const users = new Users(pool);
    const { rows } = await users.register('test_decks@test.com', 'password');
    const userId = rows[0].id;

    const deckIds = await setupDecks(pool, totalDecks, numRating, ageRating)

    // user owns onwnedDecks number of decks
    const userDecks = []
    deckIds.slice(0, ownedDecks).forEach(id => {
        userDecks.push([id, userId])

    })
    const userDeckQuery = {
        text: format('INSERT INTO user_decks (deck_id, user_id) VALUES %L', userDecks),
    }
    await pool.query(userDeckQuery)

    return { userId, deckIds }
}
