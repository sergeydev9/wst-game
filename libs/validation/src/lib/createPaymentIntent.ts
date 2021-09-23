import { body } from 'express-validator';
import validate from "./validate";

export const createPaymentIntent = [
    body('deckId').isInt(),
    body('paymentMethodType').isString(),
    validate
]