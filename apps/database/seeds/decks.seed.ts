import { Pool } from 'pg';
import { testDecks } from '@whosaidtrue/data';
import insertQuestions from './questions.seed';
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
    const decks = deckObjects.map((obj, i) => {
        if (i < 3) {
            obj.purchase_price = '0.00' // make 3 decks free
        }

        if (i % 6 == 0) {
            obj.clean = true;
        }
        if (i % 3 == 0) {
            obj.movie_rating = 'PG'


            if (i % 2 === 0) {
                obj.sfw = true; // some pg decks are sfw
            }
        }

        if (i % 2) {
            obj.sfw = false
        }

        return [...Object.values(obj)]
    })
    const query = {
        text: format('INSERT INTO decks (name, sort_order, clean, age_rating, movie_rating, sfw, status, description, purchase_price, sample_question, thumbnail_url) VALUES %L RETURNING id', decks),
    }

    let count = 0;

    try {
        const result = await pool.query(query)

        // insert questions for every deck
        const questionPromises = result.rows.map(deck => {
            return insertQuestions(pool, 9, deck.id);
        })

        const questionResult = await Promise.all(questionPromises);
        console.log(`Inserted ${questionResult} questions`);

        count = result.rowCount;
    } catch (e) {
        console.error(e);
    }

    return count
}


export default insertDecks;