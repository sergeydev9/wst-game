import jwt from 'jwt-decode';
import { DeckCard } from '@whosaidtrue/ui'
import { TokenPayload } from '@whosaidtrue/api-interfaces';
import { Deck } from '@whosaidtrue/app-interfaces';

export const decodeUserToken = (token: string): { user: TokenPayload } => {
    return jwt(token)
}