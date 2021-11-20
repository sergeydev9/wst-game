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

select count(*) from game_players where migration_ignore = true; -- 387 looks good


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
    Game_Player_Unique_ID,
    Game_Player_Game_PIN
from game_players
group by Game_Player_Unique_ID, Game_Player_Game_PIN
;
-- group by Game_Player_Unique_ID, Game_Player_Game_PIN as it's possible same unique id is used for different games, see Game_Player_ID in (785, 822)

select * from temp_game_players;

-- looks good we have a one-to-one mapping of Game_Player_ID -> Game_Player_Unique_ID
-- lets use this mapping for the new migration_new_game_player_id

CREATE INDEX idx1 ON temp_game_players (Game_Player_Unique_ID);
CREATE INDEX idx2 ON game_players (Game_Player_Unique_ID);

update game_players
    join temp_game_players on temp_game_players.Game_Player_Unique_ID = game_players.Game_Player_Unique_ID
        and temp_game_players.Game_Player_Game_PIN = game_players.Game_Player_Game_PIN
set game_players.migration_new_game_player_id = temp_game_players.Game_Player_ID
;


-- check
select * from game_players where migration_new_game_player_id = 0;

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
        migration_new_game_player_id,
        IF(Game_Player_Name is null, concat("no name ", migration_new_game_player_id), Game_Player_Name) as player_name,
        count(*) as c
    from game_players
    group by Game_Player_Game_PIN, LOWER(player_name)
    having count(*) > 1
) t on game_players.migration_new_game_player_id = t.migration_new_game_player_id
;


DROP TEMPORARY TABLE IF EXISTS temp_duplicate_game_player_pins;
CREATE TEMPORARY TABLE temp_duplicate_game_player_pins
select
    *,
    IF(Game_Player_Name is null, concat("no name ", migration_new_game_player_id), Game_Player_Name) as player_name,
    count(*) as c
from game_players
group by Game_Player_Game_PIN, LOWER(player_name)
having count(*) > 1
;
select * from game_players where Game_Player_Name = 'Josh';

select * from temp_duplicate_game_player_pins where Game_Player_ID = 42424;

-- ignore all dups
update game_players
    join temp_duplicate_game_player_pins
    on temp_duplicate_game_player_pins.migration_new_game_player_id = game_players.migration_new_game_player_id
        and temp_duplicate_game_player_pins.Game_Player_Game_PIN = game_players.Game_Player_Game_PIN
set game_players.migration_ignore = true
;

-- but keep the first player ID
select
    game_players.*
from game_players
         join temp_duplicate_game_player_pins
              on temp_duplicate_game_player_pins.Game_Player_ID = game_players.Game_Player_ID
                  and temp_duplicate_game_player_pins.Game_Player_Game_PIN = game_players.Game_Player_Game_PIN
order by game_players.Game_Player_ID
;

update game_players
    join temp_duplicate_game_player_pins
    on temp_duplicate_game_player_pins.Game_Player_ID = game_players.Game_Player_ID
        and temp_duplicate_game_player_pins.Game_Player_Game_PIN = game_players.Game_Player_Game_PIN
set game_players.migration_ignore = false
;

select game_players.*
from game_players
         join temp_duplicate_game_player_pins
              on temp_duplicate_game_player_pins.migration_new_game_player_id = game_players.migration_new_game_player_id
                  and temp_duplicate_game_player_pins.Game_Player_Game_PIN = game_players.Game_Player_Game_PIN
order by Game_Player_Game_PIN
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

-- check
select *
from game_players
         join (
    select
        IF(Game_Player_Name is null, concat("no name ", migration_new_game_player_id), Game_Player_Name) as player_name,
        count(*) as c
    from game_players
    where migration_ignore = false
    group by Game_Player_Game_PIN, LOWER(player_name)
    having count(*) > 1
) t on game_players.Game_Player_Name = t.player_name
;

select * from game_players where Game_Player_Name in ("Josh");

-- some players game a game pin that doesn't exist. Fix these by selecting a game pin from the answers table
update game_players set Game_Player_Game_PIN = "AABDW" where Game_Player_ID = 892;
update game_players set Game_Player_Game_PIN = "AABCE" where Game_Player_ID = 805;
update game_players set Game_Player_Game_PIN = "AACEX" where Game_Player_ID = 1953;
update game_players set Game_Player_Game_PIN = "AACDW" where Game_Player_ID = 1930;
update game_players set Game_Player_Game_PIN = "AABYZ" where Game_Player_ID = 1813;
update game_players set Game_Player_Game_PIN = "HFZL" where Game_Player_ID = 2286;
update game_players set Game_Player_Game_PIN = "AACEQ" where Game_Player_ID = 1941;
update game_players set Game_Player_Game_PIN = "AABEE" where Game_Player_ID = 936;
update game_players set Game_Player_Game_PIN = "AABEE" where Game_Player_ID = 932;
update game_players set Game_Player_Game_PIN = "NVVV" where Game_Player_ID = 2124;


-- EXPORT QUERY table: game_players
select
    migration_new_game_player_id as id,
    Game_ID as game_id,
    User_ID as user_id,
    IF(Game_Player_Name is null or Game_Player_Name = '', concat("no name ", migration_new_game_player_id), Game_Player_Name) as player_name,
    'legacy' as status,
    Game_Player_Create_Dt as created_at,
    Game_Player_Last_Update_Dt as updated_at
from game_players
         left join games on Game_PIN = Game_Player_Game_PIN
         left join users on User_Email = Game_Email
where game_players.migration_ignore = false
group by migration_new_game_player_id
;



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

-- confirm we don't have any questions listed in more than one deck.
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

-- fix questions with weird characters
update questions set Question_Text = "I have read someone's diary", Question_Text_For_Guess = "have read someone's diary" where Question_ID = 575;
update questions set Question_Text = "I have told a teacher I left something at home when I really just didn't do it", Question_Text_For_Guess = "have told a teacher they left something at home when they really just didn't do it" where Question_ID = 577;


-- note: question 543 has quotes and sometimes has issues importing with csv, just import it separately
-- EXPORT QUERY table: questions
select
    Question_ID as id,
    Question_Category as category,
    Question_Text as text,
    Question_Text_For_Guess as text_for_guess,
    Question_Follow_Up as follow_up,
    Deck_Question_Deck_ID as deck_id,                           -- > decks
    IF (Question_Rating = 0, 21, Question_Rating) as age_rating,
    LOWER(Question_Status) as status,
    IF(Deck_Question_Create_Dt is null, '2011-11-11 11:11:11',  Deck_Question_Create_Dt) as created_at,
    IF(Deck_Question_Last_Update_Dt is null, '2011-11-11 11:11:11',  Deck_Question_Last_Update_Dt) as updated_at
from questions
         left join deck_questions on Deck_Question_Question_ID = Question_ID
order by id
; -- 578





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

-- check
select
    Game_Question_ID,
    Game_Question_Seq_No,
    Game_Question_Create_Dt,
    migration_ignore
from game_questions
where Game_Question_Game_PIN in ('QLFK', 'XBZM')
;



-- EXPORT QUERY table: game_questions
select
    Game_Question_ID as id,
    Game_Question_Question_ID as question_id,                       -- > questions
    Game_Question_Seq_No as question_sequence_index,
    Game_ID as game_id,                                             -- > games
    null as reader_id,                                              -- >  ok as null per Brian
    null as reader_name,
    num_players as player_number_snapshot,
    Game_Question_Create_Dt as created_at,
    Game_Question_Last_Update_Dt as updated_at
from game_questions
         join games on Game_PIN = Game_Question_Game_PIN
         join questions on Question_ID = Game_Question_Question_ID
         left join (select Game_Player_Game_PIN, count(*) as num_players from game_players group by Game_Player_Game_PIN) t on Game_Player_Game_PIN = Game_Question_Game_PIN
where game_questions.migration_ignore = false
; -- 153616




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
; -- 5408

-- ignore these

alter table answers add column migration_ignore bool default false;

update answers
set migration_ignore = true
where Answer_Player_ID not in (select Game_Player_ID from game_players where migration_ignore = false)
   or Answer_Game_PIN not in (select Game_PIN from games)
   or Answer_Question_ID not in (select Question_ID from questions)
   or Answer_Question_ID not in (select Game_Question_Question_ID from game_questions where migration_ignore = false)
;

select count(*) from answers where migration_ignore = true; -- 5408 looks good


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
; -- 259171

select
    count(*)
from answers
where answers.migration_ignore = false
; -- 259541

-- the large join has less rows than just the answers talbe which makes sense


-- EXPORT QUERY table: game_answers
select
    Answer_ID as id,
    Game_Question_ID as game_question_id,                          -- > game_questions (Game_Question_Question_ID = Answer_Question_ID)
    Game_ID as game_id,                                            -- > games (Game_PIN = Answer_Game_PIN)
    migration_new_game_player_id as game_player_id,                -- > game_players
    CASE
        WHEN Answer_Result = 'T' THEN 'true'
        WHEN Answer_Result = 'F' THEN 'false'
        ELSE 'pass'
        END as value,
    Answer_Number_True_Guess as number_true_guess,
    Game_Player_Score as score,
    Answer_Create_Dt as created_at,
    Answer_Last_Update_Dt as updated_at
from answers
         join games on Game_PIN = Answer_Game_PIN
         join game_players on Game_Player_ID = Answer_Player_ID
         join game_questions on Game_Question_Question_ID = Answer_Question_ID and Game_Question_Game_PIN = Answer_Game_PIN
where answers.migration_ignore = false
  and game_players.migration_ignore = false
  and game_questions.migration_ignore = false
group by Game_Question_ID, migration_new_game_player_id             -- needed due to game_player_id, game_question_id index
; -- 259171



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
        WHEN Deck_Age_Rating = 'All Ages' THEN 0  		-- > All Ages
        WHEN Deck_Age_Rating = '11 to 14' THEN 11 		-- > 11 to 14
        WHEN Deck_Age_Rating = '13 to 17 yrs.' THEN 15  -- > 15 to 17
        WHEN Deck_Age_Rating = '15 to 17' THEN 15       -- > 15 to 17
        WHEN Deck_Age_Rating = '18 and Older' THEN 18 	-- > 18 and Older
        ELSE 'Unknown'
        END as age_rating,
    Deck_Movie_Rating as movie_rating,
    IF(Deck_SFW = "Y", TRUE, FALSE) as sfw,
    LOWER(Deck_Status) as status,
    Deck_Desc as description,
    IF(Deck_Original_Price > 0, Deck_Original_Price, 0) as purchase_price,
    example_question as sample_question,
    null as thumbnail_url,                          	-- ok as null, will add images later
    Deck_Create_Dt as created_at,
    Deck_Last_Update_Dt as updated_at
from decks
; -- 29




-- -----------------------------------------------------------------------
-- games

/* CREATE TABLE "public"."games" (
    "id" int4 NOT NULL DEFAULT nextval('games_id_seq'::regclass),
    "total_questions" int2 NOT NULL DEFAULT 0,
    "current_question_index" int2 NOT NULL DEFAULT 1,
    "access_code" varchar(10),
    "status" varchar(100) NOT NULL,
    "deck_id" int4,
    "start_date" timestamptz,
    "host_player_id" int4,
    "host_player_name" varchar(200),
    "host_id" int4,
    "end_date" timestamptz,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT "games_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE SET NULL,
    CONSTRAINT "games_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE SET NULL,
    CONSTRAINT "games_fk_host_player_id" FOREIGN KEY ("host_player_id") REFERENCES "public"."game_players"("id") ON DELETE SET NULL,
    PRIMARY KEY ("id")
); */


select count(*)
from games
where Game_Deck_ID not in (select Deck_ID from decks)
; -- 11221 games w/o a deck

select count(*)
from games
where Game_PIN not in (select Game_Player_Game_PIN from game_players)
; -- 4636 games w/o players

-- it's okay that there is missing data, we still want the games


-- check duplicate Game PIN
select Game_PIN, count(*) c
from games
group by Game_PIN
order by c desc;
-- looks good

-- create a user record for games where Game_Email is not null so we don't lose these

delete from users; -- this is ok since this table isn't used yet
ALTER TABLE users AUTO_INCREMENT = 1;
CREATE UNIQUE INDEX idx15 ON users (User_Email);

insert into users (User_Email, User_Password, User_Create_Dt, User_Last_Update_Dt)
select
    trim(coalesce(Game_Email, '')) as Game_Email,
    '' as User_Password,
    Game_Create_Dt as User_Create_Dt,
    Game_Create_Dt as User_Last_Update_Dt
from games
where trim(coalesce(Game_Email, '')) <> ''
group by Game_Email
order by Game_Create_Dt asc
;


CREATE INDEX idx14 ON game_players (Game_Player_Game_Creator);
CREATE INDEX idx16 ON games (Game_Deck_ID);
CREATE INDEX idx17 ON games (Game_Email);
CREATE INDEX idx18 ON game_players (Game_Player_Game_PIN);
CREATE INDEX idx19 ON game_players (Game_Player_Game_Creator);

select Game_Question_Game_PIN, count(*) as total_questions from game_questions group by Game_Question_Game_PIN;

-- EXPORT QUERY table: games
select
    Game_ID as id,
    IFNULL(total_questions, 0) as total_questions,
    1 as current_question_index,
    concat(Game_PIN) as access_code,
    "legacy" as status,
    IF(Game_Deck_ID > 0, Game_Deck_ID, NULL) as deck_id,        										-- > decks
    IF(Game_Create_Dt is not null, Game_Create_Dt, '2011-11-11 11:11:11') as start_date,
    migration_new_game_player_id as host_player_id,
    Game_Player_Name as host_player_name,
    User_ID as host_id,
    IF(Game_Last_Update_Dt is not null, Game_Last_Update_Dt, '2011-11-11 11:11:11') as end_date,
    'www.9truthsgame.com' as domain,
    IF(Game_Create_Dt is not null, Game_Create_Dt, '2011-11-11 11:11:11') as created_at,
    IF(Game_Last_Update_Dt is not null, Game_Last_Update_Dt, '2011-11-11 11:11:11')  as updated_at
from games
         left join decks on Deck_ID = Game_Deck_ID
         left join game_players on Game_Player_Game_PIN = Game_PIN and Game_Player_Game_Creator = 'YES' and game_players.migration_ignore = false -- can't pick first game player, example WTHM
         left join users on User_Email = Game_Email
         left join (select Game_Question_Game_PIN, count(*) as total_questions from game_questions group by Game_Question_Game_PIN) t on Game_Question_Game_PIN = Game_PIN
group by Game_ID
; -- 17192



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
    "password" varchar(1000),
    "roles" _user_role NOT NULL,
    "question_deck_credits" int2 NOT NULL DEFAULT 0,
    "test_account" bool NOT NULL DEFAULT false,
    "notifications" bool NOT NULL DEFAULT false,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
); */

select
    User_ID as id,
    User_Email as email,
    null as password,
    '{user}' as roles,
    0 as question_deck_credits,
    false test_account,
    false as notifications,
    "www.9truthsgame.com" as domain,
    User_Create_Dt as created_at,
    User_Last_Update_Dt as updated_at
from users;




-- -----------------------------------------------------------------------
-- user_question_ratings

/* CREATE TABLE "public"."user_question_ratings" (
    "id" int4 NOT NULL DEFAULT nextval('user_question_ratings_id_seq'::regclass),
    "question_id" int4 NOT NULL,
    "user_id" int4,
    "rating" "public"."user_rating" NOT NULL,
    CONSTRAINT "user_question_ratings_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE,
    CONSTRAINT "user_question_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL,
    PRIMARY KEY ("id")
); */


select MAX(Question_No_Great), MAX(Question_No_Bad) from questions;
-- max is 343;

CREATE TABLE `numbers` (
                           `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                           PRIMARY KEY (`id`)
);

-- insert at least 343 rows
insert into numbers () values();


-- EXPORT QUERY table: user_question_ratings
(select
     Question_ID as question_id,
     1 as user_id,
     'great' as rating
 from questions
          join numbers on id <= Question_No_Great)

union all

(select
     Question_ID as question_id,
     1 as user_id,
     'bad' as rating
 from questions
          join numbers on id <= Question_No_Bad)

order by question_id;