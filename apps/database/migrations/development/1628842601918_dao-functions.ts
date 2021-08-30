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
    WHERE active_decks.purchase_price = '0.00'
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
