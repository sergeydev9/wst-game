import { param } from 'express-validator';
export const joinGame = [param('access_code').isString().isLength({ min: 7 })]