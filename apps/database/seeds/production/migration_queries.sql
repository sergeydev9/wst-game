-- notes:
-- we have the following equivalences:

-- Answer_Question_ID = Game_Question_Question_ID = Question_ID
-- Answer_Player_ID = Game_Player_ID
-- Answer_Game_PIN = Game_Question_Game_PIN = Game_PIN

/* $v_sql2 = 'SELECT * '
        . ' FROM answers, game_questions, questions, game_players '
        . ' WHERE Answer_Question_ID = Game_Question_Question_ID '
        . ' AND Answer_Question_ID = Question_ID '
        . ' AND Answer_Player_ID = Game_Player_ID '
        . ' AND Answer_Game_PIN = Game_Question_Game_PIN '
        . ' AND Game_Player_Game_PIN = "' . $v_Game_PIN . '" '
        . ' AND Game_Question_Question_ID = "' . $v_Question_ID . '" '
        . ' AND Answer_Player_ID = "' . $v_Game_Player_ID . '"  LIMIT 10;'; */



-- -----------------------------------------------------------------------
-- game_players

/* CREATE TABLE "public"."game_players" (
    "id" int4 NOT NULL DEFAULT nextval('game_players_id_seq'::regclass),
    "game_id" int4 NOT NULL,
    "user_id" int4,
    "player_name" citext NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "game_players_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE,
    CONSTRAINT "game_players_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL,
    PRIMARY KEY ("id")
); */


-- verify game_players --> games relationship
select count(*)
from game_players
where Game_Player_Game_PIN not in (select Game_PIN from games);

-- 387 let's ignore these

alter table game_players add column migration_ignore bool default false;

update game_players
set migration_ignore = true
where Game_Player_Game_PIN not in (select Game_PIN from games);
;

select count(*) from game_players where migration_ignore = false; -- 387 looks good


-- looks like there can be multiple game_player rows that represent the same player via Game_Player_Unique_ID
-- so we can have answers referencing different Game_Player_ID but the same Game_Player_Unique_ID

select
    Answer_ID,
    Answer_Question_ID,
    Game_Player_ID,
    Game_Player_Unique_ID,
    Answer_Game_PIN,
    count(*) as c
from game_players
full join answers on Answer_Player_ID = Game_Player_ID
group by Answer_Question_ID, Answer_Game_PIN, Game_Player_Unique_ID
order by count(*) desc, Answer_Game_PIN
;

-- yes we do, example Answer_ID: (12320, 12295, 12289) with same Game_Player_Unique_ID but different Game_Player_ID for different questions in the same game NVVV
-- we need to assign a new unique game_player_id and use that for the new schema to avoid integrety violation issues

alter table game_players add column migration_new_game_player_id int(11) NOT NULL;

DROP TEMPORARY TABLE IF EXISTS temp_game_players;
CREATE TEMPORARY TABLE temp_game_players
select 
    Game_Player_ID,
    Game_Player_Unique_ID
from game_players
group by Game_Player_Unique_ID
;

select * from temp_game_players; 

-- looks good we have a one-to-one mapping of Game_Player_ID -> Game_Player_Unique_ID
-- lets use this mapping for the new migration_new_game_player_id

CREATE INDEX idx1 ON temp_game_players (Game_Player_Unique_ID);
CREATE INDEX idx2 ON game_players (Game_Player_Unique_ID);

update game_players
join temp_game_players on temp_game_players.Game_Player_Unique_ID = game_players.Game_Player_Unique_ID
set game_players.migration_new_game_player_id = temp_game_players.Game_Player_ID
;

-- check
select 
    Game_Player_ID,
    Game_Player_Unique_ID,
    migration_new_game_player_id
from game_players
order by Game_Player_Unique_ID
limit 10
;

-- looks good, now Game_Player_ID: 41772, 41773 both map to same migration_new_game_player_id: 41772

-- ensure no duplicate names per game


select *
from game_players
join (
    select
        Game_Player_Unique_ID,
        IF(Game_Player_Name is null, concat("no name ", migration_new_game_player_id), Game_Player_Name) as player_name,
        count(*) as c
    from game_players
    where migration_ignore = false
    group by Game_Player_Game_PIN, LOWER(player_name)
    having count(*) > 1
) t on game_players.Game_Player_Unique_ID = t.Game_Player_Unique_ID
;


-- ignore these (run query multiple times until 0 rows affected
update game_players
join (
    select
        Game_Player_ID,
        IF(Game_Player_Name is null, concat("no name ", migration_new_game_player_id), Game_Player_Name) as player_name,
        count(*) as c
    from game_players
    where migration_ignore = false
    group by Game_Player_Game_PIN, LOWER(player_name)
    having count(*) > 1
) t on game_players.Game_Player_ID = t.Game_Player_ID
set migration_ignore = true
;


-- EXPORT QUERY table: game_players 
select 
    migration_new_game_player_id as id,
    Game_ID as game_id,
    null as user_id,                                    -- TODO: confirm there's no way to get this mapping
    IF(Game_Player_Name is null or Game_Player_Name = '', concat("no name ", migration_new_game_player_id), Game_Player_Name) as player_name,
    Game_Player_Create_Dt as created_at,
    Game_Player_Last_Update_Dt as updated_at
from game_players
join games on Game_PIN = Game_Player_Game_PIN
where game_players.migration_ignore = false
group by migration_new_game_player_id
;




-- -----------------------------------------------------------------------
-- answers

/* CREATE TABLE "public"."game_answers" (
    "id" int4 NOT NULL DEFAULT nextval('game_answers_id_seq'::regclass),
    "game_question_id" int4 NOT NULL,
    "game_id" int4 NOT NULL,
    "game_player_id" int4 NOT NULL,
    "value" "public"."answer_value" NOT NULL,
    "number_true_guess" int2 NOT NULL,
    "score" int2,
    "question_id" int4,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "game_answers_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE,
    CONSTRAINT "game_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE SET NULL,
    CONSTRAINT "game_answers_game_question_id_fkey" FOREIGN KEY ("game_question_id") REFERENCES "public"."game_questions"("id") ON DELETE CASCADE,
    CONSTRAINT "game_answers_game_player_id_fkey" FOREIGN KEY ("game_player_id") REFERENCES "public"."game_players"("id") ON DELETE CASCADE,
    PRIMARY KEY ("id")
); */


-- first things first check to make the relationships are valid since there are no fk constraints setup
--   * answers --> game_players
--   * answers --> games
--   * answers --> game_questions
--   * answers --> questions

select count(*)
from answers
where Answer_Player_ID not in (select Game_Player_ID from game_players where migration_ignore = false)
or Answer_Game_PIN not in (select Game_PIN from games)
or Answer_Question_ID not in (select Question_ID from questions)
or Answer_Question_ID not in (select Game_Question_Question_ID from game_questions where migration_ignore = false)
; -- 4388

-- ignore these

alter table answers add column migration_ignore bool default false;

update answers
set migration_ignore = true
where Answer_Player_ID not in (select Game_Player_ID from game_players where migration_ignore = false)
or Answer_Game_PIN not in (select Game_PIN from games)
or Answer_Question_ID not in (select Question_ID from questions)
or Answer_Question_ID not in (select Game_Question_Question_ID from game_questions where migration_ignore = false)
;

select count(*) from answers where migration_ignore = true; -- 4388 looks good


CREATE INDEX idx1 ON temp_table (Game_Player_Unique_ID);
CREATE INDEX idx2 ON game_players (Game_Player_Unique_ID);
CREATE INDEX idx4 ON answers (Answer_Game_PIN);
CREATE INDEX idx5 ON games (Game_PIN);
CREATE INDEX idx6 ON answers (Answer_Question_ID);
CREATE INDEX idx7 ON game_questions (Game_Question_Question_ID);
CREATE INDEX idx8 ON game_questions (Game_Question_Game_PIN);


-- double check the counts
select 
    count(*)
from answers
join games on Game_PIN = Answer_Game_PIN
join game_players on Game_Player_ID = Answer_Player_ID
join game_questions on Game_Question_Question_ID = Answer_Question_ID and Game_Question_Game_PIN = Answer_Game_PIN
where answers.migration_ignore = false
and game_players.migration_ignore = false
and game_questions.migration_ignore = false
; -- 246226

select 
    count(*)
from answers
where answers.migration_ignore = false 
; -- 246526

-- the large join has less rows than just the answers talbe which makes sense


-- EXPORT QUERY table: game_answers 
select 
    Answer_ID as id,
    Game_Question_ID as game_question_id,                           -- > game_questions (Game_Question_Question_ID = Answer_Question_ID)
    Game_ID as game_id,                                            -- > games (Game_PIN = Answer_Game_PIN)
    migration_new_game_player_id as game_player_id,                -- > game_players
    CASE
        WHEN Answer_Result = 'T' THEN 'true'
        WHEN Answer_Result = 'F' THEN 'false'
        ELSE 'pass'         
    END as value,
    Answer_Number_True_Guess as number_true_guess,
    Game_Player_Score as score,                                     -- TODO: do we want this?
    Answer_Question_ID as question_id,                              -- > questions
    Answer_Create_Dt as created_at,
    Answer_Last_Update_Dt as updated_at
from answers
join games on Game_PIN = Answer_Game_PIN
join game_players on Game_Player_ID = Answer_Player_ID
join game_questions on Game_Question_Question_ID = Answer_Question_ID and Game_Question_Game_PIN = Answer_Game_PIN
where answers.migration_ignore = false 
and game_players.migration_ignore = false
and game_questions.migration_ignore = false
; -- 246043



-- -----------------------------------------------------------------------
-- questions

/* CREATE TABLE "public"."questions" (
    "id" int4 NOT NULL DEFAULT nextval('questions_id_seq'::regclass),
    "text" text NOT NULL,
    "text_for_guess" text NOT NULL,
    "follow_up" text NOT NULL,
    "deck_id" int4 NOT NULL,
    "age_rating" int2 NOT NULL,
    "status" "public"."question_status" NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "questions_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE CASCADE,
    PRIMARY KEY ("id")
); */

-- TODO: confirm we don't have any questions listed in more than one deck.
-- if we do additional work will be needed to dedup
select *
from deck_questions
group by Deck_Question_Question_ID
having count(*) > 1;
;

-- confirm the questions --> decks relationship is valid
select *
from questions
join deck_questions on Deck_Question_Question_ID = Question_ID
where Deck_Question_Deck_ID not in (select Deck_ID from decks)
;

-- note: question 543 has quotes and sometimes has issues importing with csv, just import it separately
-- EXPORT QUERY table: questions 
select
    Question_ID as id,
    Question_Text as text,
    Question_Text_For_Guess as text_for_guess,
    Question_Follow_Up as follow_up,
    Deck_Question_Deck_ID as deck_id,                           -- > decks
    Question_Rating as age_rating,
    LOWER(Question_Status) as status,
    IF(Deck_Question_Create_Dt is null, now(),  Deck_Question_Create_Dt) as created_at,
    IF(Deck_Question_Last_Update_Dt is null, now(),  Deck_Question_Last_Update_Dt) as updated_at
from questions
left join deck_questions on Deck_Question_Question_ID = Question_ID
order by id
; -- 578



-- -----------------------------------------------------------------------
-- decks

/* CREATE TABLE "public"."decks" (
    "id" int4 NOT NULL DEFAULT nextval('decks_id_seq'::regclass),
    "name" varchar(200) NOT NULL,
    "sort_order" int2 NOT NULL,
    "clean" bool NOT NULL,
    "age_rating" int2 NOT NULL,
    "movie_rating" varchar(50) NOT NULL,
    "sfw" bool NOT NULL,
    "status" "public"."deck_status" NOT NULL,
    "description" text NOT NULL,
    "purchase_price" money NOT NULL,
    "example_question" text,
    "thumbnail_url" varchar(1000),
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
); */

-- EXPORT QUERY table: decks 
select
    Deck_ID as id,
    Deck_Name as name,
    Deck_Sort_Order as sort_order,
    IF(Deck_Clean = "Y", TRUE, FALSE) as clean,
    CASE
        WHEN Deck_Age_Rating = 'All Ages' THEN 0
        WHEN Deck_Age_Rating = '11 to 14' THEN 15
        WHEN Deck_Age_Rating = '13 to 17 yrs.' THEN 15
        WHEN Deck_Age_Rating = '15 to 17' THEN 15
        WHEN Deck_Age_Rating = '18 and Older' THEN 18
        ELSE 'Unknown'  
    END as age_rating,  
    Deck_Movie_Rating as movie_rating,
    IF(Deck_SFW = "Y", TRUE, FALSE) as sfw,
    LOWER(Deck_Status) as status,
    Deck_Desc as description,
    IF(Deck_Original_Price > 0, Deck_Original_Price, 0) as purchase_price,
    null as example_question,                           -- TODO: where does this data come from?
    null as thumbnail_url,                          -- TODO: default deck image?
    Deck_Create_Dt as created_at,
    Deck_Last_Update_Dt as updated_at
from decks
; -- 29


-- -----------------------------------------------------------------------
-- game_questions

/* CREATE TABLE "public"."game_questions" (
    "id" int4 NOT NULL DEFAULT nextval('game_questions_id_seq'::regclass),
    "question_id" int4,
    "question_sequence_index" int2,
    "game_id" int4 NOT NULL,
    "reader_id" int4,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "game_questions_reader_id_fkey" FOREIGN KEY ("reader_id") REFERENCES "public"."game_players"("id") ON DELETE SET NULL,
    CONSTRAINT "game_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE SET NULL,
    CONSTRAINT "game_questions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE,
    PRIMARY KEY ("id")
); */


-- verify relationships:
--   * game_questions --> games
--   * game_questions --> questions

select count(*)
from game_questions
where Game_Question_Game_PIN not in (select Game_PIN from games)            -- 3212
or Game_Question_Question_ID not in (select Question_ID from questions);    -- 6

-- total 3218, ignore these

alter table game_questions add column migration_ignore bool default false;

update game_questions
set migration_ignore = true
where Game_Question_Game_PIN not in (select Game_PIN from games) 
or Game_Question_Question_ID not in (select Question_ID from questions);
;

select count(*) from game_questions where migration_ignore = true; -- 3218 looks good

CREATE INDEX idx10 ON game_questions (Game_Question_Game_PIN);
CREATE INDEX idx11 ON game_questions (Game_Question_Question_ID);
CREATE INDEX idx9 ON game_questions (Game_Question_Seq_No);
CREATE INDEX idx12 ON game_players (Game_Player_Reader_No);
CREATE INDEX idx13 ON game_questions (migration_ignore);

-- check if we can get the reader_id through the Game_Player_Reader_No = Game_Question_Seq_No
select * 
from game_questions
left join game_players on Game_Player_Game_PIN = Game_Question_Game_PIN and Game_Player_Reader_No = Game_Question_Seq_No
where Game_Question_Game_PIN = 'NTMM'
and Game_Player_Reader_No is null 
;

-- check duplicate game_id, question_sequence_index
select *
from game_questions
join games on Game_PIN = Game_Question_Game_PIN
join questions on Question_ID = Game_Question_Question_ID
group by Game_PIN, Game_Question_Seq_No
having count(*) > 1;

-- only 2 games QLFK, XBZM
select * from games where Game_PIN in ('QLFK', 'XBZM')
;

select * from game_questions where Game_Question_Game_PIN in ('QLFK', 'XBZM')
;


-- ignore the older ones
update game_questions
set migration_ignore = true
where Game_Question_Game_PIN in ('QLFK', 'XBZM')
and Game_Question_Create_Dt < '2020-01-01'
;


-- EXPORT QUERY table: game_questions 
select
    Game_Question_ID as id,
    Game_Question_Question_ID as question_id,                       -- > questions
    Game_Question_Seq_No as question_sequence_index,
    Game_ID as game_id,                                             -- > games
    null as reader_id,                                            -- > game_players TODO: do we want this?
    Game_Question_Create_Dt as created_at,
    Game_Question_Last_Update_Dt as updated_at
from game_questions
join games on Game_PIN = Game_Question_Game_PIN
join questions on Question_ID = Game_Question_Question_ID
-- left join game_players on Game_Player_Game_PIN = Game_Question_Game_PIN and Game_Player_Reader_No = Game_Question_Seq_No
where game_questions.migration_ignore = false
and games.migration_ignore = false
; -- 153616



-- -----------------------------------------------------------------------
-- games

/* CREATE TABLE "public"."games" (
    "id" int4 NOT NULL DEFAULT nextval('games_id_seq'::regclass),
    "access_code" varchar(200),
    "status" varchar(100) NOT NULL,
    "deck_id" int4,
    "start_date" timestamptz,
    "host_name" varchar(200),
    "host_id" int4,
    "end_date" timestamptz,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "games_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE SET NULL,
    CONSTRAINT "games_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE SET NULL,
    PRIMARY KEY ("id")
); */


select count(*)
from games
where Game_Deck_ID not in (select Deck_ID from decks)
; -- 11103 games w/o a deck

select count(*)
from games
where Game_PIN not in (select Game_Player_Game_PIN from game_players) 
; -- 4208 games w/o players

-- it's okay that there is missing data, we still want the games


-- check duplicate Game PIN
select Game_PIN, count(*) c
from games
group by Game_PIN
order by c desc;

select * from games where Game_PIN in ('BINT', 'ARSE', 'BARF');

select * from answers where Answer_Game_PIN in ('BINT', 'ARSE', 'BARF');
select * from game_players where Game_Player_Game_PIN in ('BINT', 'ARSE', 'BARF');
select * from game_questions where Game_Question_Game_PIN in ('BINT', 'ARSE', 'BARF');

-- ignore these

alter table games add column migration_ignore bool default false;

update games
set migration_ignore = true
where Game_PIN in ('BINT', 'ARSE', 'BARF');

select count(*) from games where migration_ignore = true; -- 6 looks good


CREATE INDEX idx14 ON game_players (Game_Player_Game_Creator);



-- EXPORT QUERY table: games 
select
    Game_ID as id,
    Game_PIN as access_code,
    "" as status,
    IF(Game_Deck_ID > 0, Game_Deck_ID, NULL) as deck_id,        -- > decks
    null as start_date,                                         -- > TODO: same as created_at?
    null as host_name,                                              -- TODO: use Game_Player_Name
    null as host_id,                                                -- > users: TODO: can't get this data since no game_player --> user relationship
    null as end_date,                                               -- > TODO: same as updated_at?
    IF(Game_Create_Dt is not null, Game_Create_Dt, NOW()) as created_at,
    IF(Game_Last_Update_Dt is not null, Game_Last_Update_Dt, NOW())  as updated_at
from games
left join decks on Deck_ID = Game_Deck_ID
-- left join game_players on Game_Player_Game_PIN = Game_PIN and Game_Player_Game_Creator = 'YES'
where migration_ignore = false
group by Game_ID
; -- 16176


-- -----------------------------------------------------------------------
-- playernames

/* CREATE TABLE "public"."generated_names" (
    "id" int4 NOT NULL DEFAULT nextval('generated_names_id_seq'::regclass),
    "name" citext NOT NULL,
    "clean" bool NOT NULL,
    "times_displayed" int4 NOT NULL DEFAULT 0,
    "times_chosen" int4 NOT NULL DEFAULT 0,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
); */

-- EXPORT QUERY table: playernames 
select
    Playername_ID as id,
    Playername_Name as name,
    IF(Playername_Clean = 'Y', TRUE, FALSE) as clean,
    Playername_Times_Displayed as times_displayed,
    Playername_Times_Chosen as times_chosen,
    Playername_Create_Dt as created_at,
    Playername_Last_Update_Dt as updated_at
from playernames
group by name
; -- 38980


-- -----------------------------------------------------------------------
-- users

/* CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "email" varchar(1000) NOT NULL,
    "password" varchar(1000) NOT NULL,
    "roles" _user_role NOT NULL,
    "question_deck_credits" int2 NOT NULL DEFAULT 0,
    "test_account" bool NOT NULL DEFAULT false,
    "notifications" bool NOT NULL DEFAULT false,
    "password_reset_code" text,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
); */

select 
    User_ID as id,
    User_Email as email,
    User_Password as password,
    IF(User_Security_Level = 1, "{user,admin}", '{user}') as roles,
--  asdf as question_deck_credits,
    IF(User_Test_Account = "Y", TRUE, FALSE) as test_account,
--  asdf as notifications,
--  asdf as password_reset_code,
    User_Create_Dt as created_at,
    User_Last_Update_Dt as updated_at
from users;

