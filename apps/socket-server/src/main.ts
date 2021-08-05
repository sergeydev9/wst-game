import App from './app/App'
const app = new App();

// need to setup express-ws (handled in App) before loading routes
// https://www.npmjs.com/package/express-ws
import IndexRoute from "./app/routes/index.route";
import GameRoute from "./app/routes/game.route";
app.initializeRoutes([new IndexRoute().router, new GameRoute().router]);

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
