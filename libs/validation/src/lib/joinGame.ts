import { body } from 'express-validator';
import validate from './validate';
export const joinGame = [body('access_code').isString().isLength({ min: 6, max: 6 }), body('name'), validate]