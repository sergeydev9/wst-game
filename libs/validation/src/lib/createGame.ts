import { body } from 'express-validator';
import validate from './validate';
export const createGame = [body('deck_id').isNumeric(), body('player_id').isNumeric(), validate]