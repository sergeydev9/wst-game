import { Pool } from 'pg'
import { Jobs } from '@whosaidtrue/data';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: 5432
});

const jobs = new Jobs(pool);

export { pool, jobs };