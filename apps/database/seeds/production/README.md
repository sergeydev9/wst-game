Production data from 9truthsgame.com exported for the new schema.

# Import Queries

All queries documented in `migration_queries.sql`.
The results of the queries were exported to CSV files and then imported into the new schema.



# Import order for CSV

 - generated_names
 - decks
 - questions ( -> decks)
   -- change deck_id is_nullable=YES
 - users
 - games ( -> decks, users, game_players)
 - game_players ( -> games, users)
 - game_questions ( -> game_players, questions, games)
 - game_question_543 (this is on it's own since CSV import was breaking due to quotes)
 - game_answers ( -> game_questions, game_players, games, questions)
   -- change score to int4

See `whosaidtrue-full.dump` which was created after the CSV import.


# TODO:
 - implement the 3 changes for import to work
 - copy dev migrations as production
 - create a clean seed file
