import App from './app/App'
import { pool } from './app/db'

const app = new App();

app.listen();

process.on("exit", () => {
  pool.end();
})