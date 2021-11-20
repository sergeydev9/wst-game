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



# Import dumpfile

The dump `whosaidtrue-production-seed.dump` was created with TablePlus on 11/20/2021.
It contains a data-only export of all tables except `pgmigrations`.

It was imported successfully in prod on 11/20/2021.
