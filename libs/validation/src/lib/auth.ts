import { body } from 'express-validator';
import validate from './validate';

export const validateAuth = [
    body('email').isEmail(),
    body('password').isStrongPassword({ minLength: 8, minNumbers: 1, minUppercase: 0, minSymbols: 0 }),
    validate
]