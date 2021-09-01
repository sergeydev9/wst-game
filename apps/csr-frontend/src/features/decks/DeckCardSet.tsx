import { Deck } from '@whosaidtrue/app-interfaces';
import { DeckSet, DeckCard } from '@whosaidtrue/ui';
import { useAppDispatch } from '../../app/hooks';
import { setFullModal } from '../modal/modalSlice';
import { setSelectedDeck } from './deckSlice';

export interface DeckCardSetProps {
    decks: Deck[],
    owned: boolean;
}
const DeckCardSet: React.FC<DeckCardSetProps> = ({ decks, owned }) => {
    const dispatch = useAppDispatch()

    const deckHelper = (decks: Deck[]) => {
        return decks.map((deck, i) => {
            return (
                <DeckCard
                    key={i}
                    name={deck.name}
                    thumbnailUrl={deck.thumbnail_url || './assets/placeholder.svg'}
                    movieRating={deck.movie_rating}
                    onClick={() => {
                        dispatch(setSelectedDeck({ deck, isOwned: owned }))
                        dispatch(setFullModal('deckDetails'))
                    }}
                />
            )
        })
    }

    return (
        <DeckSet>
            {deckHelper(decks)}
        </DeckSet>
    )
}

export default DeckCardSet;