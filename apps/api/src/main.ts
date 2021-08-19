import App from './app/App'
import { pool } from './app/db'

const app = new App();

app.listen();

// no dangling connections
process.on('beforeExit', () => pool.end())
process.on('exit', () => pool.end())
process.on('uncaughtException', () => pool.end())
process.on('SIGINT', () => pool.end())
process.on('SIGQUIT', () => pool.end())
process.on('SIGTERM', () => pool.end())