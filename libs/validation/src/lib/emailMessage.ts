import { body } from 'express-validator';
import validate from './validate';

export const emailMessage = [
    body('email').isEmail(),
    body('name').isLength({ min: 2, max: 500 }),
    body('message').isLength({ min: 2, max: 20000 }),
    body('category').isLength({ min: 3, max: 200 }),
    validate
]