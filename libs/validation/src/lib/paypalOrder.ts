import { body } from 'express-validator';
import validate from "./validate";

export const paypalOrder = [body('orderID').isString(), body('deckId').isInt(), validate]