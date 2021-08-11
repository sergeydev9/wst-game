import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    // users
    pgm.createTable('users', {
        id: 'id',
        email: { type: 'varchar(1000)', notNull: true, unique: true },
        password: { type: 'varchar(1000)', notNull: true },
        roles: { type: 'varchar(200)[]' },
        questionDeckCredits: { type: 'smallint', notNull: true, default: 0 },
        testAccount: { type: 'boolean', notNull: true, default: false },
        notifications: { type: 'boolean', notNull: true, default: false },
        language: { type: 'varchar(10)', notNull: false, default: 'us-en' },
        gender: { type: 'char(1)', notNull: false }, // TODO: create custom type?
        ageRange: { type: 'varchar(20)', notNull: false }, // TODO: create custom type?
        appDownloaded: { type: 'boolean', notNull: false, default: false },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updatedAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    })

    // decks
    pgm.createTable('decks', {
        id: 'id',
        name: { type: 'string', notNull: true },
        sortOrder: { type: 'smallint', notNull: true },
        clean: { type: 'string', notNull: true },
        ageRating: { type: 'string', notNull: true },
        movieRating: { type: 'string', notNull: true },
        SFW: { type: 'boolean', notNull: true },
        status: { type: 'string', notNull: true }, // TODO: Create custom type
        description: { type: 'string', notNull: true },
        purchasePrice: { type: 'money', notNull: true },
    })

    // games
    pgm.createTable('games', {
        id: 'id',
        accessCode: { type: 'varchar(20)', notNull: false },
        hostId: {
            type: 'integer',
            references: '"gamePlayers"',
            notNull: false,
            onDelete: 'SET NULL'
        },
        status: { type: 'varchar(100)', notNull: true }, // TODO: create custom type? what are the possible values?
        startDate: { type: 'timestamp', notNull: false },
        endDate: { type: 'timestamp', notNull: false }
    })

    // questions
    pgm.createTable('questions', {
        text: { type: 'text', notNull: true },
        textForGuess: { type: 'text', notNull: true },
        followUp: { type: 'text', notNull: true },
        deckId: { type: 'integer', notNull: true, references: '"decks"' },
        ageRating: { type: 'smallint', notNull: true },
        status: { type: 'varchar(20)', notNull: true } // TODO: create custom type
    })

    // gamePlayers
    pgm.createTable('gamePlayers', {
        id: 'id',
        gameId: {
            type: 'integer',
            references: '"games',
            notNull: true,
            onDelete: 'CASCADE'
        },
        playerName: { type: 'varchar(200)', notNull: true }
    })

    // gameUsers
    pgm.createTable('gameUsers', {
        id: 'id',
        gameId: {
            type: 'integer',
            references: '"games',
            notNull: true,
            onDelete: 'CASCADE'
        },
        userId: {
            type: 'integer',
            references: '"users',
            notNull: true,
            onDelete: 'CASCADE'
        },
    })

    // gameQuestions
    pgm.createTable('gameQuestions', {
        id: 'id',
        questionId: {
            type: 'integer',
            references: '"questions',
            notNull: false,
            onDelete: 'SET NULL'
        },
        questionSequenceIndex: { type: 'smallint', notNull: false },
        gameId: {
            type: 'integer',
            references: '"games',
            notNull: true,
            onDelete: 'CASCADE'
        },
        readerId: {
            type: 'integer',
            references: '"gamePlayers',
            notNull: false,
            onDelete: 'SET NULL'
        },
    })

    // generatedNames
    pgm.createTable('generatedNames', {
        id: 'id',
        name: { type: 'varchar(200)', notNull: true },
        clean: { type: 'boolean', notNull: true },
        timesDisplayed: { type: 'integer', notNull: true, default: 0 }
    })

    // gameAnswers
    pgm.createTable('gameAnswers', {
        id: 'id',
        gameQuestionId: {
            type: 'integer',
            references: '"gameQuestions"',
            notNull: true,
            onDelete: 'CASCADE'
        },
        gameId: {
            type: 'integer',
            references: '"games"',
            notNull: true,
            onDelete: 'CASCADE',
        },
        gamePlayerId: {
            type: 'integer',
            references: '"gamePlayers"',
            notNull: true,
            onDelete: 'CASCADE',
        },
        value: { type: 'varchar(5)', notNull: true },
        numberTrueGuess: { type: 'integer', notNull: true },
        score: { type: 'smallint', notNull: false }
    })

    // userDecks
    pgm.createTable('userDecks', {
        id: 'id',
        userId: { type: 'serial', notNull: true, references: 'users' },
        deckId: { type: 'serial', notNull: true, references: 'decks' }
    })

    // userSessions
    pgm.createTable('userSessions', {
        id: 'id',
        userId: { type: 'serial', notNull: true, references: 'users' },

    })

}

// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
