import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    // all decks with status 'active'
    pgm.createView('active_decks', {}, `
    SELECT * FROM decks
    WHERE decks.status = 'active'
    `)

    // all questions with status 'active'
    pgm.createView('active_questions', {}, `
    SELECT * FROM questions
    WHERE questions.status = 'active'
    `)

    // delete existing host for game
    pgm.createFunction('delete_host_for_game', [], { returns: 'trigger', language: 'plpgsql' }, `
    BEGIN
        DELETE FROM game_hosts WHERE game_hosts.game_id = NEW.game_id;
        RETURN NEW;
    END`)

    // get host for game
    pgm.createFunction('get_game_host', [{ mode: 'IN', type: 'integer', name: 'input_game_id' }], { returns: 'table(id integer, player_name text)', language: 'plpgsql' }, `
    BEGIN
        RETURN QUERY SELECT
            game_players.id,
            game_players.player_name::text
        FROM game_players
        LEFT JOIN game_hosts ON game_hosts.game_player_id = game_players.id
        WHERE game_hosts.game_id = input_game_id;
    END`)

    // get questions for game
    // TODO: finish
    // pgm.createFunction('get_game_questions', [], { returns: '', language: 'plpgsql' }, `

    // `)

    // get number of users that answered 'true' on a given game_question.id
    pgm.createFunction('number_true_answers', [{ mode: 'IN', type: 'integer', name: 'gqId' }], { returns: 'smallint', onNull: true, language: 'plpgsql' }, `
    BEGIN
        RETURN(SELECT Count(*) FROM "game_answers" AS answers WHERE answers."game_question_id" = "gqId" AND answers."value" = 'true');
    END`)


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

    // delete existing host for game before inserting new one
    pgm.createTrigger('game_hosts', 'delete_host', {
        when: 'BEFORE',
        operation: 'INSERT',
        level: 'ROW',
        function: 'delete_host_for_game',
    })


}
// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
