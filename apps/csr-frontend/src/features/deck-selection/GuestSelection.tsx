import { Link } from 'react-router-dom';
import { filteredNotOwned } from "./deckSelectionSlice"
import { useAppSelector } from "../../app/hooks"
import { DeckSet, Divider, Headline } from "@whosaidtrue/ui"
import { cardsFromSet } from '../../util/functions';

const GuestSelection: React.FC = () => {
    const decks = useAppSelector(filteredNotOwned);

    // first 3 decks before the division line
    const topDecks = decks.slice(0, 3)
    const topCards = cardsFromSet(topDecks)

    // rest of the decks below the line
    const bottomDecks = decks.slice(3)
    const bottomCards = cardsFromSet(bottomDecks)


    return (
        <>
            <DeckSet>
                {topCards}
            </DeckSet>
            <div className="w-2/3 lg:w-full flex flex-row place-items-center gap-4 text-white-ish h-8">
                <Divider dividerColor='white' />
                <Headline className="w-max flex-shrink-0">Can't find your decks? <Link className="cursor-pointer underline" to="/login">Log In</Link></Headline>
                <Divider dividerColor='white' />
            </div>
            <DeckSet>
                {bottomCards}
            </DeckSet>
        </>
    )
}

export default GuestSelection