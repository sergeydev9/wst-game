import { Deck } from '@whosaidtrue/app-interfaces';
import { DeckSet, DeckCard, Modal, NoFlexBox } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectFullModalFactory, setFullModal } from '../modal/modalSlice';
import DeckDetailsModal from './DeckDetailsModal';
import {
    setSelectedDeck,
    clearSelectedDeck,
} from './deckSlice';

export interface DeckCardSetProps {
    decks: Deck[],
    owned: boolean;
}
const DeckCardSet: React.FC<DeckCardSetProps> = ({ decks, owned }) => {
    const dispatch = useAppDispatch()
    const isModalOpen = useAppSelector(selectFullModalFactory('deckDetails'))

    const closeHandler = () => {
        dispatch(setFullModal(''))
        dispatch(clearSelectedDeck())
    }

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
        <>
            <DeckSet>
                {deckHelper(decks)}
            </DeckSet>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeHandler}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-28rem">
                    <DeckDetailsModal />
                </NoFlexBox>

            </Modal>
        </>
    )
}

export default DeckCardSet;