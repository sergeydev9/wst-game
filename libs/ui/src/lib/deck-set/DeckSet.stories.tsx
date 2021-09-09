import DeckSetComponent from './DeckSet';
import DeckCard from '../deck-card/DeckCard';

export default {
    component: DeckSetComponent,
    title: 'Page Sections/Deck Set'
}

export const DeckSet = () => {
    return (
        <div className="container mx-auto">
            <DeckSetComponent>
                <DeckCard name="In your 20s" thumbnailUrl="./placeholder.svg" movieRating="PG-13" />
                <DeckCard name="At Work" thumbnailUrl="./placeholder.svg" movieRating="PG-13" />
                <DeckCard name="Guys Night Out" thumbnailUrl="./placeholder.svg" movieRating="R" />
                <DeckCard name="Happy Hour" thumbnailUrl="./placeholder.svg" movieRating="R" />
                <DeckCard name="Family Fun" thumbnailUrl="./placeholder.svg" movieRating="G" />
            </DeckSetComponent>
        </div>

    )
}