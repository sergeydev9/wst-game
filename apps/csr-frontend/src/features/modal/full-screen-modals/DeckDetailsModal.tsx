import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { isLoggedIn, selectDeckCredits } from '../../auth/authSlice';
import { DeckDetails, Title1, Headline, ModalContent } from '@whosaidtrue/ui';
import { getSelectedDeck, selectIsOwned } from '../../decks/deckSlice';
import { fetchDetails } from '../../auth/authSlice';
import { setFullModal } from '../../modal/modalSlice';
import DeckDetailsButton from './DeckDetailsButton';

const DeckDetailsModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector(isLoggedIn)
    const credits = useAppSelector(selectDeckCredits)
    const deck = useAppSelector(getSelectedDeck)
    const isOwned = useAppSelector(selectIsOwned)

    useEffect(() => {
        // If user is logged in, refresh account details.
        // This is to make sure deck credits value is up to date.
        if (loggedIn) {
            dispatch(fetchDetails())
        }
    }, [loggedIn, dispatch])

    const loginClick = () => {
        dispatch(setFullModal('login'))
    }

    return (
        <ModalContent $narrow>
            <Title1 className="text-center mb-6 mt-2">{deck.name}</Title1>
            <DeckDetails {...deck}></DeckDetails>

            <div className="w-full sm:w-2/3">
                <DeckDetailsButton deck={deck} isOwned={isOwned} />
            </div>

            {!loggedIn && !isOwned && (<>
                <Headline className="text-center">Already own this deck?</Headline>
                <Headline className="underline cursor-pointer text-center" onClick={loginClick}>Log in</Headline>
            </>
            )}
            {loggedIn && credits > 0 && <Headline className="text-center">You have a FREE Question Deck credit available</Headline>}
        </ModalContent>
    )
}

export default DeckDetailsModal