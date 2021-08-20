import { validationResult, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from 'express';

/**
 * Builds and returns an error if validation chain failed.
 *
 * Must be placed AFTER validators in the middleware chain.
 *
 * This method must be placed at the end of any validation chain, or else
 * the validator won't have any effect on the request.
 */
const validate = (req: Request, res: Response, next: NextFunction) => {
    try {
        // if there are validation errors, throw
        validationResult(req).throw();
        next();
    } catch (err) {
        // send error report and 422 status
        const report = err.array().map((error: ValidationError) => ({ msg: error.msg, param: error.param })); // never return 'value' here. Could leak sensitive info on password errors.
        res.status(422).json(report)
    }

}

export default validate;