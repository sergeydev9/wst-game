import DeckCard from './DeckCard';

export default {
    component: DeckCard,
    title: 'Cards/Deck'
}


export const Deck = () => {
    return <DeckCard thumbnailUrl="./placeholder.svg" name="In your 20s" movieRating="PG-13" />
}