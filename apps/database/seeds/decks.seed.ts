import { Pool } from 'pg';
import { testDecks } from '@whosaidtrue/data';
import format from 'pg-format';

/**
 * Insert given number of decks into the database
 *
 * @param {Pool} pool
 * @param {number} num
 */
const insertDecks = async (pool: Pool, num: number) => {
    const deckObjects = [...testDecks(num)];

    // need array of the values for each deck object
    const decks = deckObjects.map(obj => [...Object.values(obj)])
    const query = {
        text: format('INSERT INTO decks (name, sort_order, clean, age_rating, movie_rating, sfw, status, description, purchase_price, example_question, thumbnail_url) VALUES %L RETURNING id', decks),
    }

    return pool.query(query);
}

export default insertDecks;