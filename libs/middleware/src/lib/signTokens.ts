import jwt from 'jsonwebtoken';
import { TokenPayload } from '@whosaidtrue/api-interfaces';

export const signUserPayload = (user: TokenPayload) => {
    return jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: '1w' });
}

export const signGuestPayload = (user: TokenPayload) => {
    return jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
}

export const signResetPayload = (email: string) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' }) // keep very short lived
}

export const signGameToken = (playerId: number, playerName: string, isHost: boolean, gameId: number) => {
    return jwt.sign({ playerId, playerName, gameId, isHost }, process.env.JWT_SECRET, { expiresIn: '6h' }) // keep very short lived
}