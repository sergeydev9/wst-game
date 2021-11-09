import { body } from 'express-validator';
import validate from './validate';

export const joinGame = [body('access_code').isString().isLength({ min: 4, max: 4 }), body('name').isString(), validate]