import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_DB: str(),
    POSTGRES_HOST: str(),
    DB_POOL_MIN: str(),
    DB_POOL_MAX: str(),
    JWT_SECRET: str(),
  });
}

export default validateEnv;
