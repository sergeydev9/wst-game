import { query } from 'express-validator';
export const joinGame = [query('access_code').isString().isLength({ min: 7 })]