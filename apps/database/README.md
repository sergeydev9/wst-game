# DATABASE
This directory contains the migrations and seeds, both for production and development environments.

<br/>

Table of Contents
=====
- [node-pg-migrate](#node-pg-migrate)
- [Warning!!!](#warning)
- [Running Postgres and PG-Admin](#running-postgresql-and-pg-admin)
- [Connecting to PG-Admin](#connecting-to-pg-admin)
- [Tables](#current-schema)
- [Custom Types](#custom-types)
- [Functions](#functions)
- [Triggers](#triggers)
- [Indexes](#indexes)

<br />

## node-pg-migrate
----

The migrations are generated and run by `node-pg-migrate`. This library provides a Typescript wrapper for database management commands, amd maintains a table that stores a history of the migrations that have been applied.

Complete documentation for `node-pg-migrate` can be found at https://salsita.github.io/node-pg-migrate/

<br/>

## **Warning!!!**
----
Once a migration has been run **DO NOT EVER MODIFY IT WITHOUT REVERSING IT**. The migration file is a record of the operations that have run. They are meant to allow you to reproduce every step taken so far. If you need to reverse a migration, `node-pg-migrate` provides a `down` command. This `down` command will run the function associated with the migration's `up` command if possible. Both must be defined in the same file.

If the `down` command fails to reverse a migration, then a new migration must be created to make the desired changes.
<br/>


## Running Postgresql and PG-Admin in development
----

A docker-compose file is included at the root of the monorepo for running the database in development. To start the database, run `docker-compose up` from the root of the monorepo.

This will start a Postgresql container and bind it to port 5432 on the host. Make sure that port is free before starting the application.

The docker compose file will also start a pgadmin container, and bind it to port 8080 on the host.

<br/>

## Connecting to PG-Admin
----
Open your browser and navigate to `localhost:8080`.

There, enter the credentials listed in `docker-compose.yml`:

- **email**: address@email.com
- **password**: secret

![login-screen](./docs/login.png)

Once you get in, click on `Object > Create > Server`.

Here, you can create a connection to the Postgres container. In the `General` tab, give the server a name.

![server-name](./docs/name.png)

Then, in the `Connection` tab, enter the information for the database you are working on. For development, make sure these match the values in the `docker-compose.yml` file.

- **Host Name**: postgres (this is the network address of the Postgres container)
- **Port**: 5432
- **Username**: postgres
- **Password**: password

![connection-tab](./docs/connection.png)

Here you can see everything that is going on in the database.

<br/>

## Tables
-----

The following is a comprehensive list of the current list of tables in the Database:

### **users**


| Column Name | Type | Can Be Null | Unique | Default | Reference | On Delete Reference
---| --- | --- | --- | --- | --- | ---
id | integer | no | yes
email | varchar(1000) | no | yes
password | varchar(1000) | no | no
roles | user_role[] | no | no | ["user"]
questionDeckCredits | smallint | no | no | 0
testAccount | boolean | no | no | false
notifications | boolean | no | no | false
language | varchar(50) | no | no | "en-US"
gender | varchar(50) | yes | no
ageRange | varchar(20) | no | no
appDownloaded | boolean | no | no | false
createdAt | timestamp | no | no | now()
updatedAt | timestamp | no | no | now()

<br />

### **decks**

| Column Name | Type | Can Be Null | Unique | Default | Reference | On Delete Reference
---| --- | --- | --- | --- | --- | ---
id | integer | no | yes
name | varchar(200) | no | yes
sortOrder | smallint | no | no
clean | boolean | no | no
ageRating | smallint | no | no
movieRating | varchar(50) | no | no
SFW | boolean | no | no
status | deck_status | no | no
description | text | no | no
purchasePrice | money | no | no
exampleQuestion | text | no | no
thumbnailURL | varchar(1000) | no | no
createdAt | timestamp | no | no | now()
updatedAt | timestamp | no | no | now()

<br />

### **games**

| Column Name | Type | Can Be Null | Unique | Default | Reference | On Delete Reference
---| --- | --- | --- | --- | --- | ---
id | integer | no | yes
accessCode | varchar(200) | yes | yes
hostId | integer | yes | no | | game_players | SET NULL
status | varchar(100) | no | no
startDate | timestamp | no | no
endDate | timestamp | no | no
createdAt | timestamp | no | no | now()
updatedAt | timestamp | no | no | now()

<br />

### **questions**

| Column Name | Type | Can Be Null | Unique | Default | Reference | On Delete Reference
---| --- | --- | --- | --- | --- | ---
id | integer | no | yes
text | text | no | no
textForGuess | text | no | no
followUp | text | no | no
deckId | integer | no | no | | decks | CASCADE
ageRating | smallint | no | no
status | question_status | no | no
createdAt | timestamp | no | no | now()
updatedAt | timestamp | no | no | now()

<br />

### **game_players**

| Column Name | Type | Can Be Null | Unique | Default | Reference | On Delete Reference
---| --- | --- | --- | --- | --- | ---
id | integer | no | yes
playerName | varchar(200) | no | no
gameId | integer | no | no | | games | CASCADE
createdAt | timestamp | no | no | now()
updatedAt | timestamp | no | no | now()

<br />

### **game_users**

| Column Name | Type | Can Be Null | Unique | Default | Reference | On Delete Reference
---| --- | --- | --- | --- | --- | ---
id | integer | no | yes
userId | integer | no | no | | users | CASCADE
gameId | integer | no | no | | games | CASCADE
createdAt | timestamp | no | no | now()
updatedAt | timestamp | no | no | now()

<br />

### **game_questions**

| Column Name | Type | Can Be Null | Unique | Default | Reference | On Delete Reference
---| --- | --- | --- | --- | --- | ---
id | integer | no | yes
questionSequenceIndex | smallint | no | no
questionId | integer | yes | no | | questions | SET_NULL
readerId | integer | yes | no | | game_players | SET_NULL
gameId | integer | no | no | | games | CASCADE
createdAt | timestamp | no | no | now()
updatedAt | timestamp | no | no | now()

<br />

### **generated_names**

| Column Name | Type | Can Be Null | Unique | Default | Reference | On Delete Reference
---| --- | --- | --- | --- | --- | ---
id | integer | no | yes
name | varchar(200) | no | yes
clean | boolean | no | no
timesDisplayed | integer | no | no | 0
createdAt | timestamp | no | no | now()
updatedAt | timestamp | no | no | now()

<br />

### **game_answers**

| Column Name | Type | Can Be Null | Unique | Default | Reference | On Delete Reference
---| --- | --- | --- | --- | --- | ---
id | integer | no | yes
gameQuestionId | integer | no | no | | game_questions | CASCADE
gameId | integer | no | no | | games | CASCADE
gamePlayerId | integer | no | no | | game_players | CASCADE
value | answer | no | no
numberTrueGuess | smallint | yes | no
score | smallint | yes | no
createdAt | timestamp | no | no | now()
updatedAt | timestamp | no | no | now()

<br />

### **user_decks**

| Column Name | Type | Can Be Null | Unique | Default | Reference | On Delete Reference
---| --- | --- | --- | --- | --- | ---
id | integer | no | yes
userId | integer | no | no | | users | CASCADE
deckId | integer | no | no | | decks | CASCADE
createdAt | timestamp | no | no | now()
updatedAt | timestamp | no | no | now()

<br />

### **user_sessions**

| Column Name | Type | Can Be Null | Unique | Default | Reference | On Delete Reference
---| --- | --- | --- | --- | --- | ---
id | integer | no | yes
userId | integer | yes | no | | users | SET NULL
ipAddress | cidr | no | no
createdAt | timestamp | no | no | now()
updatedAt | timestamp | no | no | now()

<br />

## Custom Types
----
Some custom types have been created to improve database performance. The following is a comprehensive list of currently defined custom ENUM types:

| Type Name | ENUM values
---|---
deck_status | "active", "inactive", "pending"
question_status | "active", "inactive", "poll"
user_role | "admin", "user", "test-admin", "test-user"
answer_value | "true", "false", "pass"

<bt/>

## Functions
----
Some convenience functions have been added to use as triggers, and to make the database easier to use in general. The following is a comprehensive list of the functions currently defined in the database

<br />

### update_updatedAt_column

 - *parameters:* none
 - *returns:* row value

This function is run by update triggers on each table. It updates the updatedAt column after any updates have been perfermed if and only if the update query successfully modified the row. If an update query is sent, but no values change, then the function doesn't do anything.

### number_true_answers

- *parameters:* gameQuestionId
- *returns:* integer

Returns the number of "true" answers for a given gameQuestionId

```sql
SELECT number_true_answers(GAME_ID) # returns the calculated value as an integer
```

<bt/>

## Triggers
----

### **update_updatedAt_trigger**
- *function:* update_updatedAt_column

Sets the updatedAt column of modified rows to the current time if and only if the row was modified.

Every table has a copy of this trigger. It runs after every update operation.

<br/>

## Indexes
----
Indexes are used to improve performance of common queries, and to impose unique constraints on column sets.

Multi-column unique indexes prevent two rows from having the same set of values for **all** columns in the index. Two rows **can** have the same values for any subset of the column indexes.

The following is a comprehensive list of the current database indexes:

**single unique columns have an implied index, and are not listed here*

table | columns | unique
|---|---|---
| game_questions | gameId, questionSequenceIndex | yes
| game_players | playerName, gameId | yes
| game_answers | gameQuestionId, gamePlayerId | yes
| user_decks | userId | no

<br/>

## Extensions
----

Enabled extensions:
- pg_stat_statements (https://www.postgresql.org/docs/current/pgstatstatements.html)