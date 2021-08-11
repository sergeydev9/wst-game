import { Sequelize } from 'sequelize';
import {
    userFactory,
    deckFactory,
    userDeckFactory,
    answerFactory,
    deckQuestionFactory,
    gameFactory,
    gamePlayerFactory,
    gameQuestionFactory,
    playerNameFactory,
    questionFactory
} from '@whosaidtrue/data';
import { logger } from '@whosaidtrue/logger';



const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        underscored: true,
        freezeTableName: true,
    },
    pool: {
        min: parseInt(process.env.DB_POOL_MIN),
        max: parseInt(process.env.DB_POOL_MAX),
    },
    logQueryParameters: process.env.NODE_ENV === 'development',
    logging: (query, time) => {
        logger.info(time + 'ms' + ' ' + query);
    },
    benchmark: true,
});

sequelize.authenticate();

const DB = {
    Users: userFactory(sequelize),
    Decks: deckFactory(sequelize),
    UserDecks: userDeckFactory(sequelize),
    Questions: questionFactory(sequelize),
    DeckQuestions: deckQuestionFactory(sequelize),
    Games: gameFactory(sequelize),
    GamePlayers: gamePlayerFactory(sequelize),
    GameQuestions: gameQuestionFactory(sequelize),
    PlayerNames: playerNameFactory(sequelize),
    Answers: answerFactory(sequelize),
    sequelize, // connection instance (RAW queries)
    Sequelize, // library
};

DB.Users.hasMany(DB.UserDecks, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'decks',
});

DB.Questions.hasMany(DB.GameQuestions, {
    sourceKey: 'id',
    foreignKey: 'questionId',
    as: 'gameQuestion',
});

DB.Questions.hasMany(DB.DeckQuestions, {
    sourceKey: 'id',
    foreignKey: 'questionId',
    as: 'deckQuestions',
});

DB.PlayerNames.hasMany(DB.GamePlayers, {
    sourceKey: 'id',
    foreignKey: 'gamePlayerId',
    as: 'gamePlayer',
});

DB.Decks.hasMany(DB.UserDecks, {
    sourceKey: 'id',
    foreignKey: 'deckId',
    as: 'userDecks',
});

DB.Decks.hasMany(DB.Games, {
    sourceKey: 'id',
    foreignKey: 'deckId',
    as: 'games',
});

DB.Decks.hasMany(DB.GameQuestions, {
    sourceKey: 'id',
    foreignKey: 'deckId',
    as: 'gameDeck',
});

DB.Decks.hasMany(DB.DeckQuestions, {
    sourceKey: 'id',
    foreignKey: 'deckId',
    as: 'questionsInDeck',
});

export default DB;
