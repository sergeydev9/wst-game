import { body } from 'express-validator';
import validate from './validate';

export const validateResetEmail = [
    body('email').isEmail(),
    validate
]

export const validateResetCode = [
    body('email').isEmail(),
    body('code').isNumeric().isLength({ min: 4, max: 4 }),
    validate
]

export const validateReset = [
    body('resetToken').isJWT(),
    body('password').isStrongPassword({ minLength: 8, minNumbers: 1, minUppercase: 0, minSymbols: 0 }),
    validate
]