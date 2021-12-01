import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.createConstraint('game_players', 'name_length_limit', `
        CHECK(LENGTH(player_name) < 27);
    `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropConstraint('game_players', 'name_length_limit');
}
