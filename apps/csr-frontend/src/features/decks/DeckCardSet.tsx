import React, { useState } from 'react';
import { Deck } from '@whosaidtrue/app-interfaces';
import { DeckSet, DeckCard, Modal, NoFlexBox } from '@whosaidtrue/ui';
import DeckDetailsModal from './DeckDetailsModal';

export interface DeckCardSetProps {
    decks: Deck[],
    owned: boolean;
}
const DeckCardSet: React.FC<DeckCardSetProps> = ({ decks, owned }) => {

    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

    const deckHelper = (decks: Deck[]) => {
        return decks.map((deck, i) => {
            return (
                <DeckCard
                    key={i}
                    name={deck.name}
                    thumbnailUrl={deck.thumbnail_url || './assets/placeholder.svg'}
                    movieRating={deck.movie_rating}
                    onClick={() => setSelectedDeck(deck)}
                />
            )
        })
    }

    return (
        <>
            <DeckSet>
                {deckHelper(decks)}
            </DeckSet>
            <Modal isOpen={selectedDeck ? true : false} onRequestClose={() => setSelectedDeck(null)} shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-28rem">
                    {selectedDeck && <DeckDetailsModal deck={selectedDeck as Deck} isOwned={owned} />}
                </NoFlexBox>

            </Modal>
        </>
    )
}

export default DeckCardSet;