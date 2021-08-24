import App from './app/App'
import { pool } from './app/db'

const app = new App();

app.listen();

// no dangling connections
process.on('exit', () => pool.end())