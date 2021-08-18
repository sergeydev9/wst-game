SET search_path TO public;
INSERT INTO "decks" ("id", "name", "clean", "ageRating", "movieRating", "SFW", "status", "description", "purchasePrice", "exampleQuestion", "thumbnailUrl", "sortOrder") VALUES (1, 'Test Deck', true, 13, 'PG-13', true, 'active', 'This is a description', 1.99, 'Is this an example question?', './placeholder.png', 1);
INSERT INTO "games" ("id", "status") VALUES (1, 'in progress');
INSERT INTO "questions" ("id", "text", "textForGuess", "followUp", "deckId", "ageRating", "status") VALUES (1, 'This is the primary text', 'this is the text for guess', 'this is the follow up', 1, 17, 'active');
INSERT INTO "game_questions" ("id", "gameId") VALUES (1, 1);
INSERT INTO "game_players" ("id", "gameId", "playerName") VALUES (1, 1, 'test player 1');
INSERT INTO "game_players" ("id", "gameId", "playerName") VALUES (2, 1, 'test player 2');
INSERT INTO "game_answers" ("gameQuestionId", "gameId", "gamePlayerId", "value", "numberTrueGuess") VALUES (1, 1, 1, 'true', 1);
INSERT INTO "game_answers" ("gameQuestionId", "gameId", "gamePlayerId", "value", "numberTrueGuess") VALUES (1, 1, 2, 'true', 1);