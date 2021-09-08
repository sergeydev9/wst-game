import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;
/**
 *
 *
 * @export
 * @param {MigrationBuilder} pgm
 * @return {*}  {Promise<void>}
 */
export async function up(pgm: MigrationBuilder): Promise<void> {

    // all decks with status 'active'
    pgm.createView('active_decks', {}, `
    SELECT * FROM decks
    WHERE decks.status = 'active'
    `)

    // all decks with status 'active' and purchase_price 0
    pgm.createView('free_decks', {}, `
    SELECT
        id,
        name,
        sort_order,
        clean,
        age_rating,
        movie_rating,
        sfw,
        status,
        description,
        example_question,
        purchase_price,
        thumbnail_url
    FROM active_decks
    WHERE active_decks.purchase_price = '0.00'
    `)


    // all decks with status 'active' and purchase_price 0
    pgm.createView('not_free_decks', {}, `
    SELECT
        id,
        name,
        sort_order,
        clean,
        age_rating,
        movie_rating,
        sfw,
        status,
        description,
        example_question,
        purchase_price,
        thumbnail_url
    FROM active_decks
    WHERE active_decks.purchase_price > '0.00'
    `)

    // all questions with status 'active'
    pgm.createView('active_questions', {}, `
    SELECT * FROM questions
    WHERE questions.status = 'active'
    `)

    // delete all reset_codes older than 1 day
    pgm.createFunction('delete_reset_codes', [], { language: 'SQL' }, `
    DELETE FROM reset_codes WHERE created_at <= (NOW() - INTERVAL '1 DAY');
    `)

    // get number of users that answered 'true' on a given game_question.id
    pgm.createFunction('number_true_answers', [{ mode: 'IN', type: 'integer', name: 'gqId' }], { returns: 'smallint', onNull: true, language: 'plpgsql', parallel: 'SAFE' }, `
    BEGIN
        RETURN(SELECT Count(*) FROM "game_answers" AS answers WHERE answers."game_question_id" = "gqId" AND answers."value" = 'true');
    END`)

    pgm.createFunction('upsert_reset_code', [{ mode: 'IN', type: 'varchar(1000)', name: 'u_email' }, { mode: 'IN', type: 'varchar(4)', name: 'r_code' }], { returns: 'table(email varchar(1000))', onNull: true, language: 'plpgsql' }, `
    BEGIN
        RETURN QUERY
        INSERT INTO reset_codes (code, user_email, user_id)
        SELECT crypt(r_code, gen_salt('bf', 4)), users.email, users.id
        FROM users
        WHERE users.email = u_email
        ON CONFLICT (user_email)
        DO UPDATE SET code = crypt(r_code, gen_salt('bf', 4))
        RETURNING reset_codes.user_email;
    END`)


    // returns decks owned by a user
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
        RETURN QUERY SELECT *
        FROM not_free_decks AS decks
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

    /**
     *
     * Creates a new game row, as well as a new game_question row
     * for each question with status active that belongs to the specified
     * deck.
     *
     * On first run will create a counter sequence if one doesn't exist already.
     *
     * Resets sequence to 1 after function is done.
     *
     * Sequence will be dropped when the database session that created it ends.
     * @param d_id integer deck id
     * @param h_id integer user id of host
     *
     * @returns {id: number, access_code: string}
     */
    pgm.createFunction('create_game', [{ mode: 'IN', type: 'integer', name: 'h_id' }, { mode: 'IN', type: 'integer', name: 'd_id' }], { returns: 'table(id integer, access_code varchar(10))', language: 'plpgsql' }, `
    BEGIN
        RETURN QUERY
        WITH
        d_questions AS ( --get all active questions for the deck
            SELECT * FROM active_questions WHERE deck_id = d_id ORDER BY random()
        ),
        new_game AS ( --create new game
            INSERT INTO games (access_code, status, deck_id, host_id)
            VALUES (encode(gen_random_bytes(3), 'hex'), 'lobby', d_id, h_id)
            RETURNING games.id, games.access_code
        ), ins AS (
            INSERT INTO game_questions (game_id, question_id)
            SELECT new_game.id, d_questions.id
            FROM d_questions
            CROSS JOIN new_game
        )
        SELECT * from new_game;
    END;
    `)


}
// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
