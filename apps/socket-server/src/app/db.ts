import {Pool} from 'pg'
import {Answers, Decks, GamePlayers, GameQuestions, Games, Questions, Users} from '@whosaidtrue/data';

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

const usersDao = new Users(pool);
const gamesDao = new Games(pool);
const decksDao = new Decks(pool);
const gameQuestionsDao = new GameQuestions(pool);
const gamePlayersDao = new GamePlayers(pool);
const questionsDao = new Questions(pool);
const answersDao = new Answers(pool);

export {usersDao, gamesDao, decksDao, gameQuestionsDao, gamePlayersDao, questionsDao, answersDao, pool};