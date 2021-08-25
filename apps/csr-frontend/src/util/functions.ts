import jwt from 'jwt-decode';
import { TokenPayload } from '@whosaidtrue/api-interfaces';

export const decodeUserToken = (token: string): { user: TokenPayload } => {
    return jwt(token)
}