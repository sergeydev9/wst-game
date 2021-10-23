import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    pgm.createType('job_status', ["pending", "completed", "failed", "canceled"]);

    pgm.createTable('jobs', {
        id: 'id',
        type: { type: 'varchar(100)', notNull: true },
        status: { type: 'job_status', notNull: true, default: 'pending' },
        result: { type: 'text' },
        task_table: { type: 'varchar(100)' },
        task_id: { type: 'integer' },
        scheduled_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        started_at: { type: 'timestamptz' },
        completed_at: { type: 'timestamptz' },
        canceled_at: { type: 'timestamptz' },
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

    //
    pgm.createFunction('notify_jobs', [], { returns: 'trigger', language: 'plpgsql' }, `
    DECLARE
        channel TEXT := TG_ARGV[0];
    BEGIN
        IF NEW.status = 'pending' AND (
            NEW.status IS DISTINCT FROM OLD.status
            OR NEW.scheduled_at IS DISTINCT FROM OLD.scheduled_at )
        THEN
           PERFORM pg_notify(channel, row_to_json(NEW)::text);
        END IF;

        RETURN NULL;
    END;`);

    pgm.createTrigger('jobs', 'notify_jobs_trigger', {
        when: 'AFTER',
        operation: ['INSERT', 'UPDATE'],
        level: 'ROW',
        function: 'notify_jobs',
        functionParams: ['jobs'],
    })

    pgm.createTrigger('jobs', 'update_updated_at_trigger', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_updated_at_column'
    })

    pgm.createIndex('jobs', 'scheduled_at') // optimize picking up the next job
}

// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
