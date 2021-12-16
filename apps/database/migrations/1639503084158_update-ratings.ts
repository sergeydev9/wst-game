import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('user_question_ratings', {
    player_id: {
      type: 'integer',
      references: 'game_players',
      notNull: false,
      onDelete: 'CASCADE',
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
    },
  });

  // DM: here we are updating the legacy data to update to Nov 20th where user_id = 1 (Brian).
  pgm.sql(
      "UPDATE user_question_ratings SET created_at = '11/20/2021', updated_at = '11/20/2021' WHERE user_id = 1"
  );

  pgm.createTrigger('user_question_ratings', 'update_updated_at_trigger', {
    when: 'BEFORE',
    operation: 'UPDATE',
    level: 'ROW',
    function: 'update_updated_at_column',
  });

}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('user_question_ratings', [
    'player_id',
    'created_at',
    'updated_at',
  ]);

  pgm.dropTrigger('user_question_ratings', 'update_updated_at_trigger');
}
