import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    /**
    * ======================================
    * EXTENSIONS
    * ======================================
    */
    pgm.createExtension('pg_stat_statements');
    pgm.createExtension('pgcrypto');
    pgm.createExtension('citext');

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
        notifications: { type: 'boolean', notNull: true, default: false },
        password_reset_code: { type: 'string', notNull: false },
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
        sfw: { type: 'boolean', notNull: true },
        status: { type: 'deck_status', notNull: true }, // custom type
        description: { type: 'text', notNull: true },
        purchase_price: { type: 'money', notNull: true },
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
        deck_id: { type: 'integer', notNull: false, references: 'decks', onDelete: 'SET NULL' },
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
        deck_id: { type: 'integer', notNull: true, references: 'decks', onDelete: 'CASCADE' },
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

    // game_players
    pgm.createTable('game_players', {
        id: 'id',
        game_id: {
            type: 'integer',
            references: 'games',
            notNull: true,
            onDelete: 'CASCADE'
        },
        player_name: { type: 'citext', notNull: true },
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
    pgm.createTable('user_question_ratings', {
        id: 'id',
        question_id: { type: 'integer', notNull: true, references: 'questions', onDelete: 'CASCADE' },
        user_id: { type: 'integer', notNull: false, references: 'users', onDelete: 'SET NULL' },
        rating: { type: 'user_rating', notNull: true }
    })

    // game_users
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

    // game_questions
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

    // generated_names
    pgm.createTable('generated_names', {
        id: 'id',
        name: { type: 'citext', notNull: true, unique: true },
        clean: { type: 'boolean', notNull: true },
        times_displayed: { type: 'integer', notNull: true, default: 0 },
        times_chosen: { type: 'integer', notNull: true, default: 0 },
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

    // game_answers
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
        question_id: { type: 'integer', notNull: false, references: 'questions', onDelete: 'SET NULL' },
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

    // user_decks
    pgm.createTable('user_decks', {
        id: 'id',
        user_id: {
            type: 'integer',
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

    // user_sessions
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

    // game_hosts
    pgm.createTable('game_hosts', {
        id: 'id',
        game_id: {
            type: 'integer',
            unique: true,
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
        function: 'update_updated_at_column',
    })
    /**
     * Other triggers
     */

    /**
    * ======================================
    * INDEXES
    * ======================================
    */
    pgm.createIndex('game_questions', ['game_id', 'question_sequence_index'], { unique: true });
    pgm.createIndex('game_players', ['game_id', 'player_name'], { unique: true });
    pgm.createIndex('game_answers', 'question_id');
    pgm.createIndex('questions', 'deck_id');
    pgm.createIndex('user_decks', ['user_id', 'deck_id']);


}

// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
