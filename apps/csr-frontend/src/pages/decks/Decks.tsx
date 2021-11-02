import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { DeckSelection, selectIsGuest } from '../../features';
import { clearSelectedDeck } from '../../features/decks/deckSlice';
import { selectIsHost } from '../../features';


const Decks: React.FC = () => {
    const dispatch = useAppDispatch();
    const isGuest = useAppSelector(selectIsGuest);
    const isHost = useAppSelector(selectIsHost);

    // clear state when unmount
    useEffect(() => {
        return () => {
            dispatch(clearSelectedDeck())
        }
    }, [dispatch, isGuest, isHost])

    return (
        <DeckSelection />
    )
}

export default Decks;