import { body } from 'express-validator';
import validate from "./validate";

export const gameIdBody = [body('gameId').isInt({ min: 1, max: 2100000000000 }), validate]