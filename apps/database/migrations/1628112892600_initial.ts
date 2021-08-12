import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    // enable plpgsql
    const db_name = process.env.POSTGRES_DB;
    if (!db_name) throw new Error('POSTGRES_DB environment variable not set'); // need DB_NAME to enable plpgsql
    pgm.sql(`createlang plpgsql ${process.env.POSTGRES_DB}`);

    /**
     * ======================================
     * TABLES
     * ======================================
     */

    // users
    pgm.createTable('users', {
        id: 'id',
        email: { type: 'varchar(1000)', notNull: true, unique: true },
        password: { type: 'varchar(1000)', notNull: true },
        roles: { type: 'user_role[]', default: ["user"] }, // custom type
        questionDeckCredits: { type: 'smallint', notNull: true, default: 0 },
        testAccount: { type: 'boolean', notNull: true, default: false },
        notifications: { type: 'boolean', notNull: true, default: false },
        language: { type: 'varchar(50)', notNull: true, default: 'en-US' }, // rules for language tags defined in https://datatracker.ietf.org/doc/html/rfc4647 and https://datatracker.ietf.org/doc/html/rfc5646
        gender: { type: 'char(10)', notNull: false }, // TODO: create custom type?
        ageRange: { type: 'varchar(20)', notNull: true }, // TODO: create custom type? Maybe split into 2 integer fields?
        appDownloaded: { type: 'boolean', notNull: true, default: false },
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
        name: { type: 'varchar(200)', notNull: true, unique: true },
        sortOrder: { type: 'smallint', notNull: true },
        clean: { type: 'boolean', notNull: true },
        ageRating: { type: 'smallint', notNull: true },
        movieRating: { type: 'varchar(50)', notNull: true },
        SFW: { type: 'boolean', notNull: true },
        status: { type: 'deck_status', notNull: true }, // custom type
        description: { type: 'text', notNull: true },
        purchasePrice: { type: 'money', notNull: true },
        exampleQuestion: { type: 'text', notNull: false },
        thumbnailUrl: { type: 'varchar(1000)', notNull: false },
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

    // games
    pgm.createTable('games', {
        id: 'id',
        accessCode: { type: 'varchar(200)', notNull: false, unique: true },
        hostId: {
            type: 'integer',
            references: '"game_players"',
            notNull: false,
            onDelete: 'SET NULL'
        },
        status: { type: 'varchar(100)', notNull: true }, // TODO: create custom type? what are the possible values?
        startDate: { type: 'timestamp', notNull: false },
        endDate: { type: 'timestamp', notNull: false },
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

    // questions
    pgm.createTable('questions', {
        text: { type: 'text', notNull: true },
        textForGuess: { type: 'text', notNull: true },
        followUp: { type: 'text', notNull: true },
        deckId: { type: 'integer', notNull: true, references: '"decks"', onDelete: 'CASCADE' },
        ageRating: { type: 'smallint', notNull: true },
        status: { type: 'question_status', notNull: true }, // custom type
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

    // gamePlayers
    pgm.createTable('game_players', {
        id: 'id',
        gameId: {
            type: 'integer',
            references: '"games',
            notNull: true,
            onDelete: 'CASCADE'
        },
        playerName: { type: 'varchar(200)', notNull: false },
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

    // gameUsers
    pgm.createTable('game_users', {
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

    // gameQuestions
    pgm.createTable('game_questions', {
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
            references: '"game_players',
            notNull: false,
            onDelete: 'SET NULL'
        },
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

    // generatedNames
    pgm.createTable('generated_names', {
        id: 'id',
        name: { type: 'varchar(200)', notNull: true },
        clean: { type: 'boolean', notNull: true },
        timesDisplayed: { type: 'integer', notNull: true, default: 0 },
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

    // gameAnswers
    pgm.createTable('game_answers', {
        id: 'id',
        gameQuestionId: {
            type: 'integer',
            references: '"game_questions"',
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
            references: '"game_players"',
            notNull: true,
            onDelete: 'CASCADE',
        },
        value: { type: 'answer_value', notNull: true }, // custom type
        numberTrueGuess: { type: 'smallint', notNull: true },
        score: { type: 'smallint', notNull: false },
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

    // userDecks
    pgm.createTable('user_decks', {
        id: 'id',
        userId: {
            type:
                'integer',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE'
        },
        deckId: {
            type: 'integer',
            notNull: true,
            references: 'decks',
            onDelete: 'CASCADE'
        },
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

    // userSessions
    pgm.createTable('user_sessions', {
        id: 'id',
        userId: {
            type: 'integer',
            notNull: false,
            references: 'users',
            onDelete: 'SET NULL'
        },
        ipAddress: { type: 'cidr', notNull: true },
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

    /**
    * ======================================
    * TYPES
    * ======================================
    */

    pgm.createType('deck_status', ["active", "inactive", "pending"]);
    pgm.createType('question_status', ["active", "inactive", "poll"]);
    pgm.createType('user_role', ["admin", "user"]);
    pgm.createType('answer_value', ["true", "false", "pass"]);

    /**
    * ======================================
    * FUNCTIONS
    * ======================================
    */

    // update updatedAt column if row actually changes, else do nothing.
    pgm.createFunction('update_updatedAt_column', [], { language: 'plpgsql' }, `
    BEGIN
        IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
            NEW.updatedAt = now();
            RETURN NEW;
        ELSE
            RETURN OLD;
        END IF;
    END
    `
    )

    // get number of users that answered 'true' on a given game_question.id
    pgm.createFunction('number_true_answers', [{ mode: 'IN', type: 'int', name: 'gameQuestionId' }], { returns: 'int', onNull: true, language: 'plpgsql' }, `
    BEGIN
        SELECT count(*) FROM game_answers
        WHERE game_answer.gameQuestionId = gameQuestionId
        AND game_answer.value = "true"
    END
    `)

    /**
    * ======================================
    * TRIGGERS
    * ======================================
    */

    /* update_updatedAt triggers */

    pgm.createTrigger('decks', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })

    pgm.createTrigger('game_answers', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })

    pgm.createTrigger('games', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })

    pgm.createTrigger('game_players', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })

    pgm.createTrigger('game_users', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })

    pgm.createTrigger('game_questions', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })

    pgm.createTrigger('generated_names', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })

    pgm.createTrigger('questions', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })

    pgm.createTrigger('users', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })

    pgm.createTrigger('user_decks', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })

    pgm.createTrigger('orders', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })

    pgm.createTrigger('user_sessions', 'update_updatedAt_trigger', {
        when: 'AFTER',
        operation: 'UPDATE',
        function: 'update_updatedAt_column'
    })


    /* other triggers */


    /**
    * ======================================
    * INDEXES
    * ======================================
    */
    pgm.createIndex('game_questions', ['gameId', 'questionSequenceIndex'], { unique: true });
    pgm.createIndex('game_players', ['playerName', 'gameId'], { unique: true });
    pgm.createIndex('game_answers', ['gameQuestionId', 'gamePlayerId'], { unique: true });
    pgm.createIndex('user_decks', 'userId');


    /**
    * ======================================
    * EXTENSIONS
    * ======================================
    */
    pgm.createExtension('pg_stat_statements');
}

// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
