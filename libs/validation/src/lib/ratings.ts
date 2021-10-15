import { body } from 'express-validator';
import validate from './validate';

export const questionRating = [body('questionId').isInt({ max: 21000000000000 }), body('rating').isIn(["great", "bad"]), validate];
export const appRating = [body('rating').isIn(["great", "bad"]), validate]