import jwt from 'jwt-decode';
import { DeckCard } from '@whosaidtrue/ui'
import { TokenPayload } from '@whosaidtrue/api-interfaces';
import { Deck } from '@whosaidtrue/app-interfaces';

export const decodeUserToken = (token: string): { user: TokenPayload } => {
    return jwt(token)
}

export const cardsFromSet = (decks: Deck[]) => {
    return decks.map((deck, i) => {
        return <DeckCard key={i} name={deck.name} thumbnailUrl={deck.thumbnail_url || './assets/placeholder.svg'} movieRating={deck.movie_rating} />
    })
}