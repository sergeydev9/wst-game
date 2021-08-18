# Data

This library contains database access objects used to query the database, as well as the integration tests for those objects.

## Structure

----

The objects in this library all correspond to a table in the DB. Not all tables have a corresponding object, but all objects have a corresponding table.

All objects inherit from the abstract base database access object (DAO) found in `./lib/base.dao.ts`. This object provides a common getter for the connection pool, as well as `getById` and `deleteById` methods that are common for all child classes.

Each method has an accompanying docstring that explains what it does.

All DAO objects must be initialized with a `pg` connection pool. For example, a `Users` object can be initialized like:

```typescript
import { Pool } from 'pg';
import { Users } from '@whosaidtrue/data';

const pool = new Pool();
const users = new Users(pool);
```

This object can then be used to send queries to the database e.g.

```typescript
const newUser = await users.register({email: 'email@email.com', password: 'password', roles: ['user']});
```

For details on how to connect to a database using `pg`, see [the documentation](https://https://node-postgres.com/features/connecting).

## Test Object directory

----

These files export json objects for some of the tables in the DB. They're there to make it easier to
insert objects during tests.

## Util directory

----

- **cleanDB:**

Wipes the database. Run before each test. Totally irreversible. Obviously, don't ever run these tests against a database that isn't totally disposable.

- **testDependencySetup:**

These functions handle saving objects and their dependencies at the same time. Their purpose is to reduce the amount of repetitive set up code
when writing tests for tables that are dependent on other tables.

- **testEntityGenerators:**

Iterators that yield a specified number of some entities. These are largely interchangeable with the objects in the `test-objects` directory. But,
since they are generators, they are more flexible.

These may at some point entirely replace the `test-objects` directory. But for now, the two can co-exist.

## Tests

----

Unlike some of the other tests in this repo, the tests in this library are almost all integration tests. Their purpose is to test not just the objects in this library,
but also the configuration of the database (i.e. indexes, constraints, functions, triggers etc.). Because of this, these tests cannot run without access to a database. Additionally, they must be run sequentially rather than in parallel. Otherwise, they will conflict and break each other.

### Starting the Database

----

For these tests to work, they need access to a running postgres instance, and this instance must have an initialized database called 'test'.

If the tests cannot connect to postgres, or if there is no database called 'test', all tests will fail.

The tests are intended to run against the database started by the `docker-compose.yml` at the root of the directory. Tests should **never** be run against a
database that isn't completely disposable.

To start the database, navigate to the root of the repo and run `docker-compose up`. This will start a postgres instance, as well as a pgAdmin instance (see the [database docs](../apps/database/README.md) for more details)

For now, the 'test' database needs to be created manually if it doesn't exist yet (TODO: should make a script for this at some point).

To create the test database, log in to pgAdmin, right click on the server connection, and from the `create` dropdown, select `Database...`. This will open a window where you can create the database. All you have to do here is set the name of the database to `test`.

### Database Connection

----

For now, the credentials used to connect to the test database are stored in `./src/lib/util/testDbConnection.ts`. These are configured to match the credentials in the
root `docker-compose.yml` file. The only difference is that here the database name is set to `test`.

### Migrating the Database

----

Before the test can be run, migrations must be applied to the test database.

NPM scripts have been added to make it easier to run or reverse migrations in the test database:

- `yarn migrate-test:up` will apply **all** migrations in the `apps/database/migrations/development` directory that have not been applied yet.
- `yarn migrate-test:down` will reverse **only the last** migration that was applied.

The credentials used for these migrations are taken from the `.test.env` file at the root of the repo.

### Running the tests

----

The tests in this library must be run sequentially in order to avoid conflicts in the database.
To initialize a test run, make sure that the database is reachable, and that migrations have been applied,
then run `nx test data --runInBand`.
