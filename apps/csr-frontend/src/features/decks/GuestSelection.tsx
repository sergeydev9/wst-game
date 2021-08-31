import { Link } from 'react-router-dom';
import { filteredNotOwned, filteredOwned } from "./deckSlice"
import { useAppSelector } from "../../app/hooks"
import { Divider, Headline, Title2 } from "@whosaidtrue/ui"
import DeckCardSet from './DeckCardSet';

const GuestSelection: React.FC = () => {
    const notFree = useAppSelector(filteredNotOwned);
    const free = useAppSelector(filteredOwned);


    return (
        <>
            {free.length > 0 && (
                <>
                    <Title2 className="text-true-white">My Decks</Title2>
                    <DeckCardSet decks={free} owned={true} />
                </>
            )}
            <div className="w-2/3 lg:w-full flex flex-row place-items-center gap-4 text-white-ish h-8">
                <Divider dividerColor='white' />
                <Headline className="w-max flex-shrink-0">Can't find your decks? <Link className="cursor-pointer underline" to="/login">Log In</Link></Headline>
                <Divider dividerColor='white' />
            </div>
            <Title2 className="text-true-white">{free.length > 0 ? 'More ' : ''}Decks</Title2>
            <DeckCardSet owned={false} decks={notFree} />
        </>
    )
}

export default GuestSelection