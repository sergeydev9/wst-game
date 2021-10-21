import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { DeckSelection, selectIsGuest, logout } from '../../features';
import { clearDecks } from '../../features/decks/deckSlice';


const Decks: React.FC = () => {
    const dispatch = useAppDispatch();
    const isGuest = useAppSelector(selectIsGuest)

    // clear state when unmount
    useEffect(() => {

        // if any guest users get here, log them out
        if (isGuest) {
            dispatch(logout())
        }

        return () => {
            dispatch(clearDecks())
        }
    }, [dispatch, isGuest])

    return (
        <DeckSelection />
    )
}

export default Decks;