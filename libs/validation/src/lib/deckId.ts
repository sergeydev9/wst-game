import { body } from 'express-validator';
import validate from "./validate";

export const deckId = [body('deckId').isInt(), validate]