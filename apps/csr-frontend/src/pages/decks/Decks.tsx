import { useEffect } from 'react'
import { useAppDispatch } from '../../app/hooks';
import { DeckSelection } from '../../features';
import { clearDecks } from '../../features/decks/deckSlice';


const Decks: React.FC = () => {
    const dispatch = useAppDispatch();

    // clear state when unmount
    useEffect(() => {
        return () => {
            dispatch(clearDecks())
        }
    }, [dispatch])

    return (
        <DeckSelection />
    )
}

export default Decks;