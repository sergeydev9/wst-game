# Typical deployment

1. Build backend projects

```bash
yarn install
yarn build socket-server --prod --skip-nx-build-cache
yarn build api --prod --skip-nx-build-cache
yarn build worker --prod --skip-nx-build-cache
```

Note: you may need to edit your `.local.env` setting NODE_ENV=production if you get build errors.

2. Build docker images

```bash
docker/build.sh --push
```

3. Update `docker/ebs/docker-compose.yml` with new build images

4. Deploy

```bash
cd docker/ebs
eb deploy
```

# Setting up a new environment

Prerequisite: install `awsebcli` tools.

Create a new EBS app (once):
```bash
eb init --platform docker --profile wst-sergey --region us-east-2 --key key-sergey whosaidtrue-backend
```

Create a new environment (once):
```bash
eb create test-env
```

Deploy the current directory:
```bash
eb deploy
```

Terminate the environemnt:
```bash
eb terminate test-env
```


# Troubleshooting

Error: The ECR service failed to authenticate your private repository. The deployment failed.
Solution: Attach policy "AmazonEC2ContainerRegistryReadOnly" to the "aws-elasticbeanstalk-ec2-role" role

Error: Service isn't healthy
Solution: Edit the healthcheck ping port on the loadbalancer from 80 to 3000

Error: Can't connect to API
Solution: Ensure the loadbalancer has listeners for posts 3000 and 4001 configured instead of the default port 80.

Error: Can't connect to the database
Solution: Make sure the RDS instance is public and correct credentials are used in `.ebs.env` file