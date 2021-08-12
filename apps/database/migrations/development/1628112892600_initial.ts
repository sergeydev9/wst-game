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
        notifications: { type: 'boolean', notNull: true, default: false },
        language: { type: 'varchar(50)', notNull: true, default: 'en-US' }, // rules for language tags defined in https://datatracker.ietf.org/doc/html/rfc4647 and https://datatracker.ietf.org/doc/html/rfc5646
        gender: { type: 'char(10)', notNull: false }, // TODO: create custom type?
        age_range: { type: 'varchar(20)', notNull: true }, // TODO: create custom type? Maybe split into 2 integer fields?
        app_downloaded: { type: 'boolean', notNull: true, default: false },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
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
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    })

    // games
    pgm.createTable('games', {
        id: 'id',
        access_code: { type: 'varchar(200)', notNull: false, unique: true },

        status: { type: 'varchar(100)', notNull: true }, // TODO: create custom type? what are the possible values?
        start_date: { type: 'timestamp', notNull: false },
        end_date: { type: 'timestamp', notNull: false },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
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
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
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
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    })

    // hosts
    pgm.createTable('hosts', {
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
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    })

    // user_deck_rating
    pgm.createTable('user_deck_rating', {
        id: 'id',
        deck_id: { type: 'integer', notNull: true, references: 'decks', onDelete: 'CASCADE' },
        user_id: { type: 'integer', notNull: false, references: 'users', onDelete: 'SET NULL' },
        rating: { type: 'user_rating', notNull: true }
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
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
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
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
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
        times_displayed: { type: 'integer', notNull: true, default: 0 },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
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
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
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
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
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
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    })

    // orders
    pgm.createTable('orders', {
        id: 'id',
        status: { type: 'varchar(100)', notNull: true },
        user_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'NO ACTION' },
        deck_id: { type: 'integer', notNull: true, references: 'decks', onDelete: 'NO ACTION' },
        original_price: { type: 'money', notNull: true },
        total_taxes: { type: 'money', notNull: true, default: 0 },
        total_fees: { type: 'money', notNull: true, default: 0 },
        total_discounts: { type: 'money', notNull: true, default: 0 },
        purchase_price: { type: 'money', notNull: true },
        fulfilled_on: { type: 'timestamp', notNull: false },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    })

    // sales
    pgm.createTable('sales', {
        id: 'id',
        discount_percent: { type: 'decimal', notNull: false, default: null, check: 'discount_flat = NULL' },
        discount_flat: { type: 'money', notNull: false, default: null, check: 'discount_percent = NULL' },
        start_date: { type: 'timestamp', notNull: true, default: '-infinity' },
        end_date: { type: 'timestamp', notNull: true, default: 'infinity' },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    })

    // order_sale
    pgm.createTable('order_sales', {
        id: 'id',
        sale_id: { type: 'integer', notNull: true, references: 'sales', onDelete: 'NO ACTION' },
        order_id: { type: 'integer', notNull: true, references: 'orders', onDelete: 'CASCADE' },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
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

    pgm.createTrigger('hosts', 'update_updated_at_trigger', {
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

    pgm.createTrigger('sales', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createTrigger('order_sales', 'update_updated_at_trigger', {
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
    pgm.createIndex('hosts', 'game_id');
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
