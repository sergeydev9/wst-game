
import { useEffect } from 'react';

import { LargeTitle } from "@whosaidtrue/ui"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getDeckSelection } from './deckSelectionSlice';
import { isLoggedIn } from '../auth/authSlice';
import UserSelection from './UserSelection';
import GuestSelection from './GuestSelection';


const Decks: React.FC = () => {
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector(isLoggedIn);

    useEffect(() => {
        dispatch(getDeckSelection())
    }, [dispatch])

    return (
        <div className="container mx-auto px-4 flex flex-col items-center gap-12 max-w-max">
            <LargeTitle className="text-white text-center">Choose a Question Deck</LargeTitle>
            {loggedIn ? <UserSelection /> : <GuestSelection />}
        </div>
    )
}

export default Decks