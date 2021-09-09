import DeckCard from './DeckCard';
import placeholder from '../../assets/placeholder.svg'

export default {
    component: DeckCard,
    title: 'Cards/Deck'
}


export const Deck = () => {
    return <DeckCard thumbnailUrl={placeholder as string} name="In your 20s" movieRating="PG-13" />
}