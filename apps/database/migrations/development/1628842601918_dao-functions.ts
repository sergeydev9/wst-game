import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    /**
     * Return decks owned by the user.
     */
    pgm.createFunction('get_user_decks', [{ type: 'integer', mode: 'IN', name: 'user_id' }], { returns: 'table (id int, name varchar, sort_order int, clean boolean, age_rating int, SFW boolean, status deck_status, description varchar, example_question varchar, thumbnail_url varchar)', onNull: true, language: 'plpgsql' }, `
    DECLARE
        result record;
    BEGIN
        RETURN QUERY SELECT
            id,
            name,
            sort_order,
            clean,
            age_rating,
            SFW,
            status,
            ddescription,
            example_question,
            thumbnail_url
        FROM decks
        LEFT JOIN user_decks ON user_decks.deck_id = decks.id
        WHERE user_decks.user_id = user_id;
    END
    `)
}
// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
