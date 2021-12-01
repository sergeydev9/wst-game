import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn('games', {
        access_code_ref: {
            type: 'varchar(4)',
            notNull: false
        }
    });

    // set access_code_ref value to old access_code if an update
    // sets access code to null
    pgm.createTrigger('games', 'set_access_code_ref', {
        language: 'plpgsql',
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
    }, `
        BEGIN
            IF NEW.access_code IS NULL THEN
                NEW.access_code_ref := OLD.access_code;
            END IF;

            RETURN NEW;
        END;
    `)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn('games', 'access_code_ref')
}
