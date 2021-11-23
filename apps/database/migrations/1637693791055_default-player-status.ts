import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

// changed to initialized since a host can be initialized prior to actually joining.
export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.alterColumn('game_players', 'status', { default: 'initialized' });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.alterColumn('game_players', 'status', { default: 'joined' });
}
