# Test deployment

1. Build backend projects

```bash
yarn install
rm -rf dist
yarn build socket-server --prod --skip-nx-build-cache
yarn build api --prod --skip-nx-build-cache
yarn build worker --prod --skip-nx-build-cache
```

Note: you may need to edit your `.local.env` setting NODE_ENV=production if you get build errors.

2. Build docker images and and update `docker/ebs/docker-compose.yml` with new image tags

```bash
docker/build.sh --push
```

3. Commit build images changes and create a new tag same as the build images docker tag.

```
git commit docker/ebs/docker-compose.yml -m "deploy v20211129-0bc768e"
git push origin dev

git tag v20211125-12340f9
git push origin v20211125-12340f9
```

4. Deploy Test

```bash
cd docker/ebs
eb deploy test2-env
```



# Prod deployment

1. Rebase `prod` branch on the correct commit or tag from `dev` branch

2. Update `docker/ebs/.elasticbeanstalk/config.yml` with value `global.application_name: whosaidtrue`

3. Deploy Prod

```bash
cd docker/ebs
eb deploy prod
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


# Create least-privilege user

```sql
CREATE USER app_backend WITH PASSWORD 'password';
GRANT CONNECT ON DATABASE whosaidtrue TO app_backend;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_backend;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_backend;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_backend;
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