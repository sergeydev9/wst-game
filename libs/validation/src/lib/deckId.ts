import { body } from 'express-validator';
import validate from "./validate";

export const deckId = [body('deckId').isInt({ min: 1, max: 2100000000000 }), validate]