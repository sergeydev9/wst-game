import { Pool } from 'pg'
import { Users, Decks, Games, GeneratedNames, Orders, AppRatings, QuestionRatings } from '@whosaidtrue/data';

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
const appRatings = new AppRatings(pool);
const questionRatings = new QuestionRatings(pool);

export { users, games, decks, names, pool, orders, appRatings, questionRatings };