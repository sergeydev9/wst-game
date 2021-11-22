Production data from 9truthsgame.com exported for the new schema.

# Import Queries

All queries documented in `migration_queries.sql`.
The results of the queries were exported to CSV files and then imported into the new schema.



# Import order for CSV

 - generated_names
 - decks
 - questions ( -> decks)
 - users
 - games ( -> decks, users, game_players)
 - game_players ( -> games, users)
 - game_questions ( -> game_players, questions, games)
 - game_answers ( -> game_questions, game_players, games, questions)



# Import dumpfile to production

The dump `whosaidtrue-production-seed.dump` was created with TablePlus on 11/20/2021.
It contains a data-only export of all tables except `pgmigrations`.

This was imported successfully in prod on 11/20/2021.

After importing the migration a few issues were discovered and fixed.

**Fix 1:**

The sequences where not updated automatically after the dump import and needed to be reset with the following:

```sql
SELECT setval(pg_get_serial_sequence('decks', 'id'), coalesce(max(id),0) + 1, false) FROM decks;
SELECT setval(pg_get_serial_sequence('emails', 'id'), coalesce(max(id),0) + 1, false) FROM emails;
SELECT setval(pg_get_serial_sequence('free_credit_signups', 'id'), coalesce(max(id),0) + 1, false) FROM free_credit_signups;
SELECT setval(pg_get_serial_sequence('game_answers', 'id'), coalesce(max(id),0) + 1, false) FROM game_answers;
SELECT setval(pg_get_serial_sequence('game_players', 'id'), coalesce(max(id),0) + 1, false) FROM game_players;
SELECT setval(pg_get_serial_sequence('game_questions', 'id'), coalesce(max(id),0) + 1, false) FROM game_questions;
SELECT setval(pg_get_serial_sequence('games', 'id'), coalesce(max(id),0) + 1, false) FROM games;
SELECT setval(pg_get_serial_sequence('generated_names', 'id'), coalesce(max(id),0) + 1, false) FROM generated_names;
SELECT setval(pg_get_serial_sequence('jobs', 'id'), coalesce(max(id),0) + 1, false) FROM jobs;
SELECT setval(pg_get_serial_sequence('one_liners', 'id'), coalesce(max(id),0) + 1, false) FROM one_liners;
SELECT setval(pg_get_serial_sequence('orders', 'id'), coalesce(max(id),0) + 1, false) FROM orders;
SELECT setval(pg_get_serial_sequence('pgmigrations', 'id'), coalesce(max(id),0) + 1, false) FROM pgmigrations;
SELECT setval(pg_get_serial_sequence('questions', 'id'), coalesce(max(id),0) + 1, false) FROM questions;
SELECT setval(pg_get_serial_sequence('reset_codes', 'id'), coalesce(max(id),0) + 1, false) FROM reset_codes;
SELECT setval(pg_get_serial_sequence('user_app_ratings', 'id'), coalesce(max(id),0) + 1, false) FROM user_app_ratings;
SELECT setval(pg_get_serial_sequence('user_decks', 'id'), coalesce(max(id),0) + 1, false) FROM user_decks;
SELECT setval(pg_get_serial_sequence('user_question_ratings', 'id'), coalesce(max(id),0) + 1, false) FROM user_question_ratings;
SELECT setval(pg_get_serial_sequence('user_sessions', 'id'), coalesce(max(id),0) + 1, false) FROM user_sessions;
SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce(max(id),0) + 1, false) FROM users;
```

**Fix 2:**

The user roles were imported incorrectly as `user` and needed to be updated to `guest` with the following:

```sql
SELECT * FROM users WHERE password IS NULL AND roles = '{user}';
UPDATE users SET roles = '{guest}' WHERE password IS NULL;
```


