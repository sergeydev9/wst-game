import jwt from 'jwt-decode';
import { TokenPayload } from '@whosaidtrue/api-interfaces';

// This just makes it so the type doesn't have to be re-specified every time
export function decodeUserToken(token: string): { user: TokenPayload } {
    return jwt(token)
}

// express a guess value as a percentage of the total number of players
export function guessAsPercentage(guess: number, totalPlayers: number): string {
    return `${Math.round(100 * (guess / totalPlayers))}%`
}