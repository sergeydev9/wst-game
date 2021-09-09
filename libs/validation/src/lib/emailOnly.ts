import { body } from 'express-validator';
import validate from './validate';

export const emailOnly = [
    body('email').isEmail(),
    validate
]