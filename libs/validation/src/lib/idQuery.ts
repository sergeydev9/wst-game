import { query } from 'express-validator';
import validate from './validate';

export const idQuery = [query('id').isInt(), validate];