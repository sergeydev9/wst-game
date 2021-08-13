import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    /**
    * ======================================
    * TYPES
    * ======================================
    */
    pgm.createType('deck_status', ["active", "inactive", "pending"]);
    pgm.createType('question_status', ["active", "inactive", "poll"]);
    pgm.createType('user_role', ["admin", "user"]);
    pgm.createType('answer_value', ["true", "false", "pass"]);
    pgm.createType('user_rating', ["great", "bad"])

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
        roles: { type: 'user_role[]', notNull: true }, // custom type
        question_deck_credits: { type: 'smallint', notNull: true, default: 0 },
        test_account: { type: 'boolean', notNull: true, default: false },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })


    // decks
    pgm.createTable('decks', {
        id: 'id',
        name: { type: 'varchar(200)', notNull: true, unique: true },
        sort_order: { type: 'smallint', notNull: true },
        clean: { type: 'boolean', notNull: true },
        age_rating: { type: 'smallint', notNull: true },
        movie_rating: { type: 'varchar(50)', notNull: true },
        SFW: { type: 'boolean', notNull: true },
        status: { type: 'deck_status', notNull: true }, // custom type
        description: { type: 'text', notNull: true }, purchasePrice: { type: 'money', notNull: true },
        example_question: { type: 'text', notNull: false },
        thumbnail_url: { type: 'varchar(1000)', notNull: false },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })

    // games
    pgm.createTable('games', {
        id: 'id',
        access_code: { type: 'varchar(200)', notNull: false, unique: true },
        status: { type: 'varchar(100)', notNull: true }, // TODO: create custom type? what are the possible values?
        start_date: { type: 'timestamptz', notNull: false },
        end_date: { type: 'timestamptz', notNull: false },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })

    // questions
    pgm.createTable('questions', {
        id: 'id',
        text: { type: 'text', notNull: true },
        text_for_guess: { type: 'text', notNull: true },
        follow_up: { type: 'text', notNull: true },
        deck_id: { type: 'integer', notNull: true, references: '"decks"', onDelete: 'CASCADE' },
        age_rating: { type: 'smallint', notNull: true },
        status: { type: 'question_status', notNull: true }, // custom type
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })



    // gamePlayers
    pgm.createTable('game_players', {
        id: 'id',
        game_id: {
            type: 'integer',
            references: 'games',
            notNull: true,
            onDelete: 'CASCADE'
        },
        player_name: { type: 'varchar(200)', notNull: true },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })

    // hosts
    pgm.createTable('game_hosts', {
        id: 'id',
        game_id: {
            type: 'integer',
            references: 'games',
            notNull: true,
            onDelete: 'CASCADE'
        },
        game_player_id: {
            type: 'integer',
            references: 'game_players',
            notNull: true,
            onDelete: 'CASCADE'
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })

    // user_question_rating
    pgm.createTable('user_question_rating', {
        id: 'id',
        question_id: { type: 'integer', notNull: true, references: 'questions', onDelete: 'CASCADE' },
        user_id: { type: 'integer', notNull: false, references: 'users', onDelete: 'SET NULL' },
        rating: { type: 'user_rating', notNull: true }
    })


    // gameUsers
    pgm.createTable('game_users', {
        id: 'id',
        game_id: {
            type: 'integer',
            references: 'games',
            notNull: true,
            onDelete: 'CASCADE'
        },
        user_id: {
            type: 'integer',
            references: 'users',
            notNull: true,
            onDelete: 'CASCADE'
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })

    // gameQuestions
    pgm.createTable('game_questions', {
        id: 'id',
        question_id: {
            type: 'integer',
            references: 'questions',
            notNull: false,
            onDelete: 'SET NULL'
        },
        question_sequence_index: { type: 'smallint', notNull: false },
        game_id: {
            type: 'integer',
            references: 'games',
            notNull: true,
            onDelete: 'CASCADE'
        },
        reader_id: {
            type: 'integer',
            references: 'game_players',
            notNull: false,
            onDelete: 'SET NULL'
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })

    // generatedNames
    pgm.createTable('generated_names', {
        id: 'id',
        name: { type: 'varchar(200)', notNull: true },
        clean: { type: 'boolean', notNull: true },
        times_displayed: { type: 'integer', notNull: true, default: 0 },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })

    // gameAnswers
    pgm.createTable('game_answers', {
        id: 'id',
        game_question_id: {
            type: 'integer',
            references: 'game_questions',
            notNull: true,
            onDelete: 'CASCADE'
        },
        game_id: {
            type: 'integer',
            references: 'games',
            notNull: true,
            onDelete: 'CASCADE',
        },
        game_player_id: {
            type: 'integer',
            references: 'game_players',
            notNull: true,
            onDelete: 'CASCADE',
        },
        value: { type: 'answer_value', notNull: true }, // custom type
        number_true_guess: { type: 'smallint', notNull: true },
        score: { type: 'smallint', notNull: false },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })

    // userDecks
    pgm.createTable('user_decks', {
        id: 'id',
        user_id: {
            type:
                'integer',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE'
        },
        deck_id: {
            type: 'integer',
            notNull: true,
            references: 'decks',
            onDelete: 'CASCADE'
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })

    // userSessions
    pgm.createTable('user_sessions', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: false,
            references: 'users',
            onDelete: 'SET NULL'
        },
        ip_address: { type: 'cidr', notNull: true },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })

    // orders
    pgm.createTable('orders', {
        id: 'id',
        status: { type: 'varchar(100)', notNull: true },
        user_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'NO ACTION' },
        deck_id: { type: 'integer', notNull: true, references: 'decks', onDelete: 'NO ACTION' },
        purchase_price: { type: 'money', notNull: true },
        fulfilled_on: { type: 'timestamptz', notNull: false },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    });

    /**
    * ======================================
    * FUNCTIONS
    * ======================================
    */

    // update updated_at column if row actually changes, else do nothing.
    pgm.createFunction('update_updated_at_column', [], { returns: 'trigger', language: 'plpgsql' }, `
    BEGIN
        IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
            NEW."updated_at" = now();
            RETURN NEW;
        ELSE
            RETURN OLD;
        END IF;
    END;`)

    // get number of users that answered 'true' on a given game_question.id
    pgm.createFunction('number_true_answers', [{ mode: 'IN', type: 'integer', name: 'gqId' }], { returns: 'smallint', onNull: true, language: 'plpgsql' }, `
    BEGIN
	    RETURN(SELECT Count(*) FROM "game_answers" AS answers WHERE answers."game_question_id" = "gqId" AND answers."value" = 'true');
    END`)

    /**
    * ======================================
    * TRIGGERS
    * ======================================
    */

    /* update_updated_at triggers */

    pgm.createTrigger('decks', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('game_answers', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('games', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('game_players', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('game_users', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('game_questions', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('generated_names', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('questions', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('users', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('user_decks', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('game_hosts', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('user_sessions', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('orders', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })
    /* other triggers */


    /**
    * ======================================
    * INDEXES
    * ======================================
    */
    pgm.createIndex('game_questions', ['game_id', 'question_sequence_index'], { unique: true });
    pgm.createIndex('game_players', ['player_name', 'game_id'], { unique: true });
    pgm.createIndex('game_answers', ['game_question_id', 'game_player_id'], { unique: true });
    pgm.createIndex('questions', 'deck_id')
    pgm.createIndex('game_hosts', 'game_id');
    pgm.createIndex('user_decks', 'user_id');

    /**
    * ======================================
    * EXTENSIONS
    * ======================================
    */
    pgm.createExtension('pg_stat_statements');
}

// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
