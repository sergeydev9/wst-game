import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.alterColumn('emails', 'user_id', { notNull: false })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.alterColumn('emails', 'user_id', { notNull: true });
}
