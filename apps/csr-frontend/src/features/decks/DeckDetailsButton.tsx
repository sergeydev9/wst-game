import React from 'react';
import { useHistory } from 'react-router';
import { Deck } from '@whosaidtrue/app-interfaces'
import { Button } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { isLoggedIn } from '../auth/authSlice';

export interface DeckDetailsButtonProps {
    deck: Deck;
    isOwned: boolean;
}

const DeckDetailsButton: React.FC<DeckDetailsButtonProps> = ({ isOwned, deck }) => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector(isLoggedIn)
    const buttonText = isOwned ? 'Play Deck' : deck.purchase_price

    let handler: (e: React.MouseEvent) => void;

    if (isOwned) {
        handler = () => {
            return
        }
    } else {
        handler = () => {
            return
        }
    }
    return (
        loggedIn ? <Button type="button" onClick={handler}>{buttonText}</Button> : <Button type="button" onClick={handler}>{buttonText}</Button>
    )

}

export default DeckDetailsButton;