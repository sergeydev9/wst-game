import { Pool } from 'pg';
import { insertNames } from './generated-names.seed';


(async () => {
    const pool = new Pool({
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    })

    try {
        // seed names
        const { rows } = await insertNames(pool, 2000)

        console.log(`rows: ${rows}`)
    } catch (e) {
        console.error(e)
    } finally {
        pool.end();
    }
})();