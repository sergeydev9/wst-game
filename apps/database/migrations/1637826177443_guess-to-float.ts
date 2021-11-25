import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.alterColumn('game_answers', 'number_true_guess', { type: 'decimal' })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.alterColumn('game_answers', 'number_true_guess', { type: 'integer' })

}
