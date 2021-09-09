#!/usr/bin/env bash

set -e

# https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html
AWS_DEFAULT_REGION='us-east-2'
AWS_ACCOUNT="680712662822"
REGISTRY="${AWS_ACCOUNT}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"

echo "authenticating: ${REGISTRY}"
aws ecr get-login-password | docker login --username AWS --password-stdin ${REGISTRY}
