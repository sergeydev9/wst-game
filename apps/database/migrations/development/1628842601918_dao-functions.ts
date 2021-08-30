import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    // all decks with status 'active'
    pgm.createView('active_decks', {}, `
    SELECT * FROM decks
    WHERE decks.status = 'active'
    `)

    // all decks with status 'active' and purchase_price 0
    pgm.createView('free_decks', {}, `
    SELECT * FROM active_decks
    WHERE decks.purchase_price = 0
    `)

    // all questions with status 'active'
    pgm.createView('active_questions', {}, `
    SELECT * FROM questions
    WHERE questions.status = 'active'
    `)

    // delete all reset_codes older than 1 day
    pgm.createFunction('delete_reset_codes', [], { language: 'SQL' }, `
    DELETE FROM reset_codes WHERE created_at<=DATE_SUB(NOW(), INTERVAL 1 DAY)
    `)

    // set host user_id and player_name from player_id
    pgm.createFunction('update_host', [{ mode: 'IN', type: 'varchar(200)', name: 'h_name' }, { mode: 'IN', type: 'integer', name: 'p_id' }, { mode: 'IN', type: 'integer', name: 'g_id' }], { returns: 'game_id integer', language: 'plpgsql' }, `
    BEGIN
        RETURN QUERY
        WITH u_id AS (
            SELECT users.id
            FROM users
            LEFT JOIN game_players ON game_players.user_id = users.id
            WHERE game_players.id = p_id
            )
        IF SELECT count(u_id) = 0
            RAISE EXCEPTION 'Cannot find user id for player id %', p_id
        ELSE
            UPDATE games
            SET host_id = u_id, host_name = h_name
            WHERE games.id = g_id
            RETURNING games.id;
        END IF;
    END`)

    // get number of users that answered 'true' on a given game_question.id
    pgm.createFunction('number_true_answers', [{ mode: 'IN', type: 'integer', name: 'gqId' }], { returns: 'smallint', onNull: true, language: 'plpgsql', parallel: 'SAFE' }, `
    BEGIN
        RETURN(SELECT Count(*) FROM "game_answers" AS answers WHERE answers."game_question_id" = "gqId" AND answers."value" = 'true');
    END`)


    /**
     * Return decks owned by the user.
     */
    pgm.createFunction('user_owned_decks', [{ type: 'integer', mode: 'IN', name: 'input_id' }], { returns: 'table (id integer, name varchar(200), sort_order smallint, clean boolean, age_rating smallint, movie_rating varchar(50), sfw boolean, status deck_status, description text, example_question text, purchase_price money, thumbnail_url varchar(1000))', onNull: true, language: 'plpgsql', parallel: 'SAFE' }, `
    BEGIN
        RETURN QUERY SELECT
            decks.id,
            decks.name,
            decks.sort_order,
            decks.clean,
            decks.age_rating,
            decks.movie_rating,
            decks.sfw,
            decks.status,
            decks.description,
            decks.example_question,
            decks.purchase_price,
            decks.thumbnail_url
        FROM active_decks AS decks
        LEFT JOIN user_decks ON user_decks.deck_id = decks.id
        WHERE user_decks.user_id = input_id;
    END
    `)

    /**
     * Return decks NOT owned by the user.
     */
    pgm.createFunction('user_not_owned_decks', [{ type: 'integer', mode: 'IN', name: 'input_id' }], { returns: 'table (id integer, name varchar(200), sort_order smallint, clean boolean, age_rating smallint, movie_rating varchar(50), sfw boolean, status deck_status, description text, example_question text, purchase_price money, thumbnail_url varchar(1000))', onNull: true, language: 'plpgsql', parallel: 'SAFE' }, `
    BEGIN
        RETURN QUERY SELECT
            decks.id,
            decks.name,
            decks.sort_order,
            decks.clean,
            decks.age_rating,
            decks.movie_rating,
            decks.sfw,
            decks.status,
            decks.description,
            decks.example_question,
            decks.purchase_price,
            decks.thumbnail_url
        FROM active_decks AS decks
        WHERE NOT EXISTS ( SELECT * FROM user_decks WHERE user_decks.user_id = input_id AND user_decks.deck_id = decks.id );
    END
    `)

    // Get specified number of generated names. Names are selected randomly.
    // This method gets slower as the table grows. If the number of name
    // rows gets into the hundreds of thousands, or reaches a point where it
    // exceeds memory capacity (unlikely), consider replacing this.
    pgm.createFunction('get_name_choices', [{ mode: 'IN', type: 'smallint', name: 'num_names' }, { mode: 'IN', type: 'boolean', name: 'is_clean' }], { returns: 'table(id integer, name citext, clean boolean)', language: 'plpgsql', parallel: 'SAFE' }, `
    BEGIN
        IF is_clean = true THEN
            RETURN QUERY SELECT
                generated_names.id,
                generated_names.name,
                generated_names.clean
            FROM generated_names
            WHERE generated_names.clean = true
            ORDER BY random()
            LIMIT num_names;
        ELSE
            RETURN QUERY SELECT
                generated_names.id,
                generated_names.name,
                generated_names.clean
            FROM generated_names
            ORDER BY random()
            LIMIT num_names;
        END IF;
    END
    `)



}
// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
