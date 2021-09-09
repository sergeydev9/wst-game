import { query } from 'express-validator'
import validate from './validate'
export const deckDetails = [query('deck_id').isNumeric(), validate]