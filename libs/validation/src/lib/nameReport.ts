import { body } from 'express-validator';
import validate from "./validate";

export const validateNameReport = [body('seen').isArray(), body('seen[*]').isInt(), body('chosen').isInt(), validate]