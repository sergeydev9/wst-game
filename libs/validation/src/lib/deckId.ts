import { body } from 'express-validator';
import validate from "./validate";

export const validateDeckId = [body('deckId').isInt, validate]