import { query } from 'express-validator';
import validate from './validate';

export const getDeckSelectionQuery = [query('clean').isIn(['true', 'false']), validate]