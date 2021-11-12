import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.createTable('one_liners', {
        id: 'id',
        text: {
            type: 'varchar(2000)',
            notNull: true,
        },
        clean: {
            type: 'boolean',
            notNull: true,
            default: false
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    })

    pgm.createTrigger('one_liners', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })
}

// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
