import { Title2, Headline, Divider } from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { isLoggedIn } from '../auth/authSlice';
import { selectCurrentOwned, selectCurrentNotOwned } from "./deckSlice";
import DeckCardSet from './DeckCardSet'
import { setFullModal } from '../modal/modalSlice';

const DeckList: React.FC = () => {
    const dispatch = useAppDispatch();
    const owned = useAppSelector(selectCurrentOwned);
    const notOwned = useAppSelector(selectCurrentNotOwned);
    const loggedIn = useAppSelector(isLoggedIn);

    const loginHandler = () => {
        dispatch(setFullModal('login'))
    }

    return (
        <>
            {owned.length > 0 && (
                <>
                    <Title2 className="text-true-white">My Decks</Title2>
                    <DeckCardSet decks={owned} owned={true} />
                </>
            )}
            {!loggedIn && (
                <div className="w-2/3 lg:w-full flex flex-row place-items-center gap-4 text-white-ish h-8">
                    <Divider dividerColor='white' />
                    <Headline className="w-max flex-shrink-0 select-none">Can't find your decks? <span className="cursor-pointer underline" onClick={loginHandler}>Log In</span></Headline>
                    <Divider dividerColor='white' />
                </div>
            )}
            <Title2 className="text-true-white">{owned.length > 0 ? 'Play Other ' : ''}Decks</Title2>
            <DeckCardSet decks={notOwned} owned={false} />
        </>
    )
}

export default DeckList;