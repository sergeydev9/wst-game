import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.alterColumn('reset_codes', 'user_email', { type: 'citext' });
    pgm.dropFunction('upsert_reset_code', [{ mode: 'IN', type: 'varchar(1000)', name: 'u_email' }, { mode: 'IN', type: 'varchar(4)', name: 'r_code' }])
}

export async function down(pgm: MigrationBuilder): Promise<void> {

    pgm.alterColumn('reset_codes', 'user_email', { type: 'varchar(1000)' });
    pgm.createFunction('upsert_reset_code', [
        { mode: 'IN', type: 'varchar(1000)', name: 'u_email' },
        { mode: 'IN', type: 'varchar(4)', name: 'r_code' }
    ], { returns: 'table(email varchar(1000))', onNull: true, language: 'plpgsql' }, `
    BEGIN
        RETURN QUERY
        INSERT INTO reset_codes (code, user_email, user_id)
        SELECT crypt(r_code, gen_salt('bf', 4)), users.email, users.id
        FROM users
        WHERE users.email = u_email
        ON CONFLICT (user_email)
        DO UPDATE SET code = crypt(r_code, gen_salt('bf', 4))
        RETURNING reset_codes.user_email;
    END`)

}
