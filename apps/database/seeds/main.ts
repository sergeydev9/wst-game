import { Pool } from 'pg';
import insertNames from './generated-names.seed';
import insertDecks from './decks.seed';
import insertQuestions from './questions.seed';


(async () => {
    const pool = new Pool({
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    })

    try {
        // seed names
        const namesResult = await insertNames(pool, 500)
        namesResult.rows.length ? console.log(`Inserted ${namesResult.rowCount} names into the generated_names table`) : null

        // seed decks
        const decksResult = await insertDecks(pool, 30)
        decksResult.rows.length ? console.log(`Inserted ${decksResult.rowCount} rows into the decks table`) : null

        //seed 9 questions for every deck
        const questionPromises = decksResult.rows.map((res) => {
            const { id } = res
            return insertQuestions(pool, 9, id);
        })

        const resolved = await Promise.all(questionPromises);
        console.log(`Inserted a total of ${resolved.length * 9} rows into the questions table`)

    } catch (e) {
        console.error(e)
    } finally {
        pool.end();
    }
})();