import jwt from 'jwt-decode';
import { TokenPayload } from '@whosaidtrue/api-interfaces';

// This just makes it so the type doesn't have to be re-specified every time
export const decodeUserToken = (token: string): { user: TokenPayload } => {
    return jwt(token)
}