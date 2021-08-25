import { Link } from 'react-router-dom';
import { selectNotOwned } from "./deckSelectionSlice"
import { useAppSelector } from "../../app/hooks"
import { DeckCard, DeckSet, Divider, Headline } from "@whosaidtrue/ui"

const GuestSelection: React.FC = () => {
    const decks = useAppSelector(selectNotOwned);

    // first 3 decks before the division line
    const topDecks = decks.slice(0, 3)
    const topSet = topDecks.map((deck, i) => {
        return <DeckCard key={i} name={deck.name} thumbnailUrl={deck.thumbnail_url || './assets/placeholder.svg'} movieRating={deck.movie_rating} />
    })

    // rest of the decks below the line
    const bottomDecks = decks.slice(3)
    const bottomSet = bottomDecks.map((deck, i) => {
        return <DeckCard key={i} name={deck.name} thumbnailUrl={deck.thumbnail_url || './assets/placeholder.svg'} movieRating={deck.movie_rating} />
    })

    const dividerClass = "justify-self-stretch"
    return (
        <>
            <DeckSet>
                {topSet}
            </DeckSet>
            <div className="w-full flex flex-row place-items-center gap-4 text-white-ish h-8">
                <Divider dividerColor='white' className={dividerClass} />
                <Headline className="w-max flex-shrink-0">Can't find your decks? <Link className="cursor-pointer underline" to="/login">Log In</Link></Headline>
                <Divider dividerColor='white' className={dividerClass} />
            </div>
            <DeckSet>
                {bottomSet}
            </DeckSet>
        </>
    )
}

export default GuestSelection