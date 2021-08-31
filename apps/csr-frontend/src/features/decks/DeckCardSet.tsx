import { Deck } from '@whosaidtrue/app-interfaces';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { DeckSet, DeckCard, Modal, NoFlexBox } from '@whosaidtrue/ui';
import DeckDetailsModal from './DeckDetailsModal';
import { selectIsDetailsModalOpen, setSelectedDeck, clearSelectedDeck, getSelectedDeck, setDetailsModalState } from './deckSlice';

export interface DeckCardSetProps {
    decks: Deck[],
    owned: boolean;
}
const DeckCardSet: React.FC<DeckCardSetProps> = ({ decks, owned }) => {
    const dispatch = useAppDispatch()
    const isModalOpen = useAppSelector(selectIsDetailsModalOpen)
    const selectedDeck = useAppSelector(getSelectedDeck)

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
                        dispatch(setDetailsModalState(true))
                    }}
                />
            )
        })
    }

    return (
        <>
            <DeckSet>
                {deckHelper(decks)}
            </DeckSet>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => dispatch(clearSelectedDeck())}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-28rem">
                    <DeckDetailsModal />
                </NoFlexBox>

            </Modal>
        </>
    )
}

export default DeckCardSet;