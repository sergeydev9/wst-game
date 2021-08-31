import React from 'react';
import { Deck } from '@whosaidtrue/app-interfaces'
import { Button } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { isLoggedIn } from '../auth/authSlice';
import { createGame } from '../game/gameSlice';
import { setDetailsModalState } from './deckSlice';
import { openPreGameAuth, openLogin } from '../modal/modalSlice';
import { goToCheckout, addToCart } from '../cart/cartSlice';

export interface DeckDetailsButtonProps {
    deck: Deck;
    isOwned: boolean;
}

const DeckDetailsButton: React.FC<DeckDetailsButtonProps> = ({ isOwned, deck }) => {
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector(isLoggedIn)
    const buttonText = isOwned ? 'Play Deck' : deck.purchase_price

    const addToCartThenGoToAuth = () => {
        dispatch(addToCart(deck))
        dispatch(openLogin())
    }

    let handler: (e: React.MouseEvent) => void;

    if (isOwned) {
        handler = () => {
            dispatch(setDetailsModalState(false))
            loggedIn ? dispatch(createGame(deck.id)) : dispatch(openPreGameAuth())
        }
    } else {
        handler = () => {
            dispatch(setDetailsModalState(false))
            loggedIn ? dispatch(goToCheckout(deck.id)) : addToCartThenGoToAuth()
        }
    }
    return (
        loggedIn ? <Button type="button" onClick={handler}>{buttonText}</Button> : <Button type="button" onClick={handler}>{buttonText}</Button>
    )

}

export default DeckDetailsButton;