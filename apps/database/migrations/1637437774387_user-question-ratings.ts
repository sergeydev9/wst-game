import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('user_question_ratings', ['user_id', 'question_id'], { name: 'user_question_ratings_user_id_question_id_unique_index'});
    pgm.createIndex('user_question_ratings', ['rating']);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.createIndex('user_question_ratings', ['user_id', 'question_id'], { unique: true });
    pgm.dropIndex('user_question_ratings', ['rating']);
}
