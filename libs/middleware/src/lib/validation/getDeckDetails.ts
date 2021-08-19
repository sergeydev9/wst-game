import { query } from 'express-validator'
export const deckDetails = [query('deck_id').isNumeric()]