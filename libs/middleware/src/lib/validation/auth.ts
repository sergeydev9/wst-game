import { body } from 'express-validator';
export const auth = () => [body('email').isEmail(), body('password').isLength({ min: 8 })]