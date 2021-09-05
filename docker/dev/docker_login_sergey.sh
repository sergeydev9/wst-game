#!/usr/bin/env bash

set -e

# update the keys or profile name as needed
#export AWS_ACCESS_KEY_ID=
#export AWS_SECRET_ACCESS_KEY=
export AWS_PROFILE='wst-sergey'
export AWS_DEFAULT_REGION='us-east-2'

# https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html
AWS_ACCOUNT="680712662822"
REGISTRY="${AWS_ACCOUNT}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"

echo "authenticating: ${REGISTRY}"
aws ecr get-login-password | docker login --username AWS --password-stdin ${REGISTRY}
