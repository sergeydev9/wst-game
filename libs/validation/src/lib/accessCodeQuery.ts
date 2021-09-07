import { query } from 'express-validator';
import validate from './validate';
export const accessCodeQuery = [query('access_code').isString().isLength({ min: 6, max: 6 }), validate]