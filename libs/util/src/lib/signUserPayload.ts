import jwt from 'jsonwebtoken';
import { TokenPayload } from '@whosaidtrue/api-interfaces';

const signUserPayload = (user: TokenPayload) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1w' });
}

export default signUserPayload;