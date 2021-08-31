import { Link } from 'react-router-dom';
import { filteredNotOwned, filteredOwned } from "./deckSelectionSlice"
import { useAppSelector } from "../../app/hooks"
import { DeckSet, Divider, Headline, Title2 } from "@whosaidtrue/ui"
import { cardsFromSet } from '../../util/functions';

const GuestSelection: React.FC = () => {
    const notFree = useAppSelector(filteredNotOwned);
    const free = useAppSelector(filteredOwned);


    return (
        <>
            {free.length > 0 && (
                <>
                    <Title2 className="text-true-white">My Decks</Title2>
                    <DeckSet>
                        {cardsFromSet(free)}
                    </DeckSet>
                </>
            )}
            <div className="w-2/3 lg:w-full flex flex-row place-items-center gap-4 text-white-ish h-8">
                <Divider dividerColor='white' />
                <Headline className="w-max flex-shrink-0">Can't find your decks? <Link className="cursor-pointer underline" to="/login">Log In</Link></Headline>
                <Divider dividerColor='white' />
            </div>
            <Title2 className="text-true-white">{free.length > 0 ? 'More ' : ''}Decks</Title2>
            <DeckSet>
                {cardsFromSet(notFree)}
            </DeckSet>
        </>
    )
}

export default GuestSelection