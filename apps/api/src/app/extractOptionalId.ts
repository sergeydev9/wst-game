import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import {
    TokenPayload,
} from '@whosaidtrue/api-interfaces';

/**
 * Attempts to verify a JWT token from incoming request. If the
 * token is valid, returns the userId from the payload, otherwise returns undefined.
 *
 * This is used on routes where authentication is not required, but the behavior changes
 * depending on whether or not the user is logged in.
 *
 * @param req Incoming express request
 * @returns user
 */
function extractOptionalId(req: Request) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    let id: number;

    // if there is a token, verify it and extract user id
    if (token) {
        try {
            const { user } = jwt.verify(token, process.env.JWT_SECRET) as { user: TokenPayload }
            id = user.id;
            return id
        } catch {
            return  // fail silently if token invalid
        }
    }
}

export default extractOptionalId;