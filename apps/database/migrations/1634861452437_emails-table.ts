import {ColumnDefinitions, MigrationBuilder} from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.createTable('email_templates', {
        key: {type: 'varchar(100)', notNull: true, primaryKey: true},
        sendgrid_template_id: {type: 'varchar(100)', notNull: true},
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
    });

    pgm.createTable('emails', {
        id: 'id',
        user_id: {type: 'integer', notNull: true, references: 'users', onDelete: 'SET NULL'},

        from: {type: 'varchar(255)'},
        to: {type: 'varchar(255)', notNull: true},
        cc: {type: 'varchar(255)'},
        bcc: {type: 'varchar(255)'},

        subject: {type: 'text'},

        text: {type: 'text'},
        html: {type: 'text'},
        template_key: {type: 'varchar(100)', references: 'email_templates', onDelete: 'SET NULL'},
        template_data: {type: 'text'},

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
    });

    pgm.createConstraint('emails', 'email_text_html_or_template_required', {
        check: 'text IS NOT NULL OR html IS NOT NULL OR template_key IS NOT NULL'
    });

    pgm.createConstraint('emails', 'email_subject_required', {
        check: 'subject IS NOT NULL OR template_key IS NOT NULL'
    });

    pgm.createTrigger('emails', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })
}

// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
