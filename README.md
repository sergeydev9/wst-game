# Whosaidtrue

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

## Initial Installation

This project requires the `nx` cli to be instlaled globally. This can be done by running `yarn global add @nrwl/cli`

## Applications

Each component is split into its own application. Applications are located in the `/apps` directory.

## Libraries

Anything potentially re-usable is placed in a library, and imported into applications. These are located in the `/libs` directory.

## Development server

Run `nx serve {my-app}` for a dev server (e.g. `nx serve api`)

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## api

The api app requires a running database. Start up postgres by running `docker compose -f docker/docker-compose.yml up`. Once the database is up and running, start the api server by running `nx serve api`.

### Envirnment Variables

The api reads from the following env variables:

- POSTGRES_DB
- POSTGRES_HOST
- POSTGRES_USER
- POSTGRES_PASSWORD
- JWT_SECRET
- NODE_ENV
- PORT
- DOMAIN
- DATABASE_URL
- NX_API_BASEURL
- SG_API_KEY

These can be changed for local dev in `.local.env`

**warning** Values in `.local.env` must match values in `docker/docker-compose.yml`

## Database

Documentation for the database can be found [here](apps/database/README.md)

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@whosaidtrue/mylib`.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
