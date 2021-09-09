import DeckSetComponent from './DeckSet';
import DeckCard from '../deck-card/DeckCard';
import placeholder from '../../assets/placeholder.svg'

export default {
    component: DeckSetComponent,
    title: 'Page Sections/Deck Set'
}

export const DeckSet = () => {
    return (
        <div className="container mx-auto">
            <DeckSetComponent>
                <DeckCard name="In your 20s" thumbnailUrl={placeholder} movieRating="PG-13" />
                <DeckCard name="At Work" thumbnailUrl={placeholder} movieRating="PG-13" />
                <DeckCard name="Guys Night Out" thumbnailUrl={placeholder} movieRating="R" />
                <DeckCard name="Happy Hour" thumbnailUrl={placeholder} movieRating="R" />
                <DeckCard name="Family Fun" thumbnailUrl={placeholder} movieRating="G" />
            </DeckSetComponent>
        </div>

    )
}