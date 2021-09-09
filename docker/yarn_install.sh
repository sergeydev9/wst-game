#!/usr/bin/env bash

set -e

if [[ ! -f "package.json" ]]; then
	echo "This script is meant to be executed from project root..."
	echo "  $ docker/yarn_install.sh"
	exit -1
fi

docker run --rm -it \
	-v ${PWD}:/app \
	-w /app \
	node:14 \
	yarn install
