import { body } from 'express-validator';
import validate from './validate';

// DEV NOTE: add notifications here when that feature is rolled out
export const validateUserUpdate = [
    body('email').isEmail(),
    validate
]