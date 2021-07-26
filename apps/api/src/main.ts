import App from './app/App'
import AuthRoute from './app/routes/auth.route';
import IndexRoute from './app/routes/index.route';
import UsersRoute from './app/routes/users.route';
import DecksRoute from './app/routes/decks.route';
import validateEnv from './app/utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute().router, new UsersRoute().router, new AuthRoute().router, new DecksRoute().router]);

app.listen();

// TODO: apply proper error reporting before production
process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });