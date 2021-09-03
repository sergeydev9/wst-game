import { Pool } from 'pg'
import { Users, Decks, Games, GeneratedNames, Orders } from '@whosaidtrue/data';



// TODO: adapt this to RDS
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: 5432
});



const users = new Users(pool);
const games = new Games(pool);
const decks = new Decks(pool);
const names = new GeneratedNames(pool);
const orders = new Orders(pool);

export { users, games, decks, names, pool, orders };