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
    pgm.createType('user_role', ["admin", "user", "guest", "test"]);
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
        password: { type: 'varchar(1000)', notNull: false }, // guests can have null passwords
        roles: { type: 'user_role[]', notNull: true }, // custom type
        question_deck_credits: { type: 'smallint', notNull: true, default: 0 },
        test_account: { type: 'boolean', notNull: true, default: false },
        notifications: { type: 'boolean', notNull: true, default: false },
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
        name: { type: 'varchar(1000)', notNull: true, unique: true },
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
    // DEV_NOTE type of host_name on games table is varchar, but it's citext
    // in the game_players.name table. This is done for storage reasons.
    // As a result of this, the type needs to be cast
    // for any query that tries to directly set the value from one to the other.
    pgm.createTable('games', {
        id: 'id',
        total_questions: { type: 'smallint', notNull: true, default: 0 },
        current_question_index: { type: 'smallint', notNull: true, default: 1 },
        access_code: { type: 'varchar(10)', notNull: false, unique: true },
        status: { type: 'varchar(100)', notNull: true },
        deck_id: { type: 'integer', notNull: false, references: 'decks', onDelete: 'SET NULL' },
        start_date: { type: 'timestamptz', notNull: false },
        host_player_name: { type: 'varchar(200)', notNull: false },
        host_id: { type: 'integer', notNull: false, references: 'users', onDelete: 'SET NULL' },
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
        deck_id: { type: 'integer', notNull: false, references: 'decks', onDelete: 'SET NULL' },
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
        user_id: { type: 'integer', notNull: false, references: 'users', onDelete: 'SET NULL' },
        player_name: { type: 'citext', notNull: true },
        status: { type: 'varchar(100)', notNull: true, default: 'joined' }, // joined, disconnected, or removed
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
        reader_name: {
            type: 'varchar(1000)',
            notNull: false
        },
        player_number_snapshot: { // number of players connected at start of question
            type: 'smallint',
            notNull: false
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
        number_true_guess: { type: 'smallint', notNull: false },
        score: { type: 'integer', notNull: false },
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
        user_id: { type: 'integer', notNull: false, references: 'users', onDelete: 'SET NULL' },
        deck_id: { type: 'integer', notNull: false, references: 'decks', onDelete: 'SET NULL' },
        credits_used: { type: 'boolean', notNull: true, default: false }, // true if user used free deck credits to make this purchase
        payment_processor_data: { type: 'jsonb', notNull: false }, // json data. PaymentIntent for stripe.
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

    // DEV_NOTE should add a counter and limit resets
    pgm.createTable('reset_codes', {
        id: 'id',
        user_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'CASCADE' },
        user_email: { type: 'varchar(1000)', notNull: true, unique: true },
        code: { type: 'text', notNull: true }, // encrypted
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

    pgm.createTrigger('reset_codes', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column',
    })

    /**
    * ======================================
    * INDEXES
    * ======================================
    */
    pgm.createIndex('game_questions', ['game_id', 'question_sequence_index'], { unique: true });
    pgm.createIndex('game_players', ['game_id', 'player_name'], { unique: true });
    pgm.createIndex('game_answers', ['game_player_id', 'game_question_id'], { unique: true }) // prevent more than 1 answer by same player for same question
    pgm.createIndex('questions', 'deck_id');
    pgm.createIndex('user_decks', ['user_id', 'deck_id']); // speed up finding a user's decks
    pgm.createIndex('decks', 'purchase_price') // pick out free decks faster


}

// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
