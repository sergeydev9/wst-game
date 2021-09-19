import { filteredNotOwned, filteredOwned } from "./deckSlice";
import { Link } from 'react-router-dom';
import { useAppSelector } from "../../app/hooks";
import { Title2, Headline, Divider } from "@whosaidtrue/ui";
import { isLoggedIn } from '../auth/authSlice';
import DeckCardSet from './DeckCardSet'

const DeckList: React.FC = () => {
    const owned = useAppSelector(filteredOwned); // for users that aren't logged in, owned = free
    const notOwned = useAppSelector(filteredNotOwned);
    const loggedIn = useAppSelector(isLoggedIn);


    return (
        <>
            {owned.length > 0 && (
                <>
                    <Title2 className="text-true-white">My Decks</Title2>
                    <DeckCardSet decks={owned} owned={true} />
                </>
            )}
            {!loggedIn && (<div className="w-2/3 lg:w-full flex flex-row place-items-center gap-4 text-white-ish h-8">
                <Divider dividerColor='white' />
                <Headline className="w-max flex-shrink-0 select-none">Can't find your decks? <Link className="cursor-pointer underline" to="/login">Log In</Link></Headline>
                <Divider dividerColor='white' />
            </div>)}
            <Title2 className="text-true-white">{owned.length > 0 ? 'Play Other ' : ''}Decks</Title2>
            <DeckCardSet decks={notOwned} owned={false} />
        </>
    )
}

export default DeckList;