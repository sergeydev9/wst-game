#!/usr/bin/env bash

set -e

usage() {
	echo "usage: $0 [--push]"
	echo "where: "
	echo "       --push: (optional) flag to push docker image tag"
	echo ""
	echo "your args: $@"
	exit 1
}

push_flag=$1

if [[ -n "$push_flag" && "$push_flag" != '--push' ]]; then
	usage $@
fi


if [[ ! -f "package.json" ]]; then
	echo "This script is meant to be executed from project root..."
	echo "  $ docker/build.sh"
	exit -1
fi

# update the keys or profile name as needed
# TODO: refactor to read from env when setting up CI/CD
#export AWS_ACCESS_KEY_ID=
#export AWS_SECRET_ACCESS_KEY=
export AWS_PROFILE='wst-sergey'
export AWS_DEFAULT_REGION='us-east-2'

# https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html
AWS_ACCOUNT="680712662822"
REGISTRY="${AWS_ACCOUNT}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"


TAG=$(date +%Y-%m-%d)

API_IMAGE="${REGISTRY}/whosaidtrue/api:${TAG}"
echo "building: ${API_IMAGE}"
docker build . --target api -t ${API_IMAGE} -f docker/Dockerfile

SOCKET_IMAGE="${REGISTRY}/whosaidtrue/socket-server:${TAG}"
echo "building: ${SOCKET_IMAGE}"
docker build . --target socket-server -t ${SOCKET_IMAGE} -f docker/Dockerfile


if [[ -n "$push_flag" ]]; then
	echo "authenticating: ${REGISTRY}"
	aws ecr get-login-password | docker login --username AWS --password-stdin ${REGISTRY}

	echo "pushing: ${API_IMAGE}"
	docker push "${API_IMAGE}"

	echo "pushing: ${SOCKET_IMAGE}"
	docker push "${SOCKET_IMAGE}"
fi