import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.createView('active_decks', {}, `
    SELECT * FROM decks
    WHERE decks.status = 'active'
    `)

    pgm.createView('active_questions', {}, `
    SELECT * FROM questions
    WHERE questions.status = 'active'
    `)

    // TODO: finish if desired.
    // pgm.createFunction('generate_game_questions', [{ type: 'integer', mode: 'IN', name: 'game_id' }, { type: 'integer', mode: 'IN', name: 'q_number' }], { returns: 'table (id integer, text text, text_for_guess text, follow_up text, deck_name text, question_sequence_index integer, question_total integer, question_id integer)', language: 'plpgsql' }, `
    // DECLARE
    //     question_total int8 := 0;
    // BEGIN
    //     FOR deck_question IN
    //         SELECT id AS question_id
    // END
    // `)

    /**
     * Return decks owned by the user.
     */
    pgm.createFunction('user_owned_decks', [{ type: 'integer', mode: 'IN', name: 'input_id' }], { returns: 'table (id integer, name varchar(200), sort_order smallint, clean boolean, age_rating smallint, movie_rating varchar(50), sfw boolean, status deck_status, description text, example_question text, thumbnail_url varchar(1000))', onNull: true, language: 'plpgsql' }, `
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
            decks.thumbnail_url
        FROM active_decks AS decks
        LEFT JOIN user_decks ON user_decks.deck_id = decks.id
        WHERE user_decks.user_id = input_id;
    END
    `)

    /**
     * Return decks NOT owned by the user.
     */
    pgm.createFunction('user_not_owned_decks', [{ type: 'integer', mode: 'IN', name: 'input_id' }], { returns: 'table (id integer, name varchar(200), sort_order smallint, clean boolean, age_rating smallint, movie_rating varchar(50), sfw boolean, status deck_status, description text, example_question text, purchase_price money, thumbnail_url varchar(1000))', onNull: true, language: 'plpgsql' }, `
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


}
// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
