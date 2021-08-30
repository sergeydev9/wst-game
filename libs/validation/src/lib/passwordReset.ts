import { body } from 'express-validator';
import validate from './validate';

export const validateReset = [
    body('email').isEmail(),
    validate
]