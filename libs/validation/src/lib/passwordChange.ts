import { body } from 'express-validator';
import validate from './validate';

export const validatePassordChange = [
    body('oldPass').isStrongPassword({ minLength: 8, minNumbers: 1, minUppercase: 0, minSymbols: 0 }),
    body('newPass').isStrongPassword({ minLength: 8, minNumbers: 1, minUppercase: 0, minSymbols: 0 }),
    validate
]
