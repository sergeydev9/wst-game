import { Pool } from 'pg';
import insertNames from './generated-names.seed';
import insertDecks from './decks.seed';
import { insertCypressUsers } from './users.seed';
import { insertOneLiners } from './one-liners.seed';


(async () => {
    const pool = new Pool({
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    })

    try {

        // seed cypress test users
        const cypressCount = insertCypressUsers(pool)
        console.log(`Inserted ${cypressCount} test users`)

        // seed names
        const namesResult = await insertNames(pool, 500)
        console.log(`Inserted ${namesResult} names into the generated_names table`)

        // seed decks
        const decksResult = await insertDecks(pool, 30)
        console.log(`Inserted ${decksResult} rows into the decks table`)

        // insert one liners
        const oneLinersResult = await insertOneLiners(pool);
        console.log(`Inserted ${oneLinersResult.rowCount} one liners`)

    } catch (e) {
        console.error(e)
    } finally {
        pool.end();
    }
})();