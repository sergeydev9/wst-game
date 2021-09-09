# Docker Scripts

This directory contains docker scripts for running, building, and uploading docker images 
for development and production.



# Installing Dependencies

Before running in development mode the `package.json` file needs to be installed. This is 
usually accomplished with `yarn install` but for simplicity you can use the `install.sh` 
script which will install all dependencies using dockerized version of node.


```bash
yarn install
```

OR
```bash
docker/isntall.sh
```



# Running in Development Mode

Use the `docker-compose.web.yml` file to run the web and api services in development mode.
This depends on the root `docker-compose.yml` that runs postgres.

To start:
```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.web.yml up -d
```

To stop:
```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.web.yml stop
```

Note: The postgres database will need to be setup on first run. See (apps/database/README.md) for more details.

Connect to the `api` instance and execute the yarn migrate command:
```bash
docker compose -f docker/docker-compose.web.yml exec api bash
# yarn migrate-dev:up
```


# Building for Production

Use the `build.sh` script to build and upload the docker images to Amazon's docker registry.

Note: before running this script set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` 
or the `AWS_PROFILE` that setup in your `~/.aws/credentials`.

To build:
```bash
docker/build.sh
```

OR to build and upload

```bash
docker/build.sh --push
```