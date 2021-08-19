import { body } from 'express-validator';
export const createGame = [body('deck_id').isNumeric(), body('player_id').isNumeric()]