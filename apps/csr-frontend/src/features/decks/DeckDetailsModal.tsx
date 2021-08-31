import { Deck } from '@whosaidtrue/app-interfaces';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { isLoggedIn, selectDeckCredits } from '../auth/authSlice';
import { DeckDetails, Title1, Button, Headline } from '@whosaidtrue/ui';

export interface DeckDetailsModalProps {
    isOwned: boolean;
    deck: Deck;
}
const DeckDetailsModal: React.FC<DeckDetailsModalProps> = ({ deck, isOwned }) => {
    const loggedIn = useAppSelector(isLoggedIn)
    const credits = useAppSelector(selectDeckCredits)

    return (
        <>
            <Title1 className="text-center mb-6 mt-2">{deck.name}</Title1>
            <DeckDetails {...deck}></DeckDetails>
            <div className="my-8 px-16">
                {isOwned ? <Button>Play Deck</Button> : <Button>{deck.purchase_price}</Button>}
            </div>
            {!loggedIn && !isOwned && (<>
                <Headline className="text-center">Already own this deck?</Headline>
                <Headline className="underline cursor-pointer text-center"><Link to="/login">Log in</Link></Headline>
            </>
            )}
            {loggedIn && credits && <Headline className="text-center">You have a FREE Question Deck credit available</Headline>}
        </>
    )
}

export default DeckDetailsModal