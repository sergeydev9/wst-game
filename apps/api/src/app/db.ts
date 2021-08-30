import { Pool } from 'pg'
import { Users, Decks, Games, GeneratedNames } from '@whosaidtrue/data';

let pool: Pool;

if (process.env.NODE_ENV !== 'production') {
    pool = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        port: 5432
    })

} else {
    // TODO: If using Amazon Rdb then process is differnt.
    pool = new Pool();
}

if (!pool) throw new Error('Postgres connection pool unavailable')

const users = new Users(pool);
const games = new Games(pool);
const decks = new Decks(pool);
const names = new GeneratedNames(pool);

export { users, games, decks, names, pool };