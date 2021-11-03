import { body } from 'express-validator';
import validate from './validate';

export const validateUserUpdate = [
    body('email').isEmail(),
    validate
]