import React from 'react';
import { Deck } from '@whosaidtrue/app-interfaces'
import { Button } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { isLoggedIn, selectIsGuest } from '../auth/authSlice';
import { createGame } from '../game/gameSlice';
import { setFullModal } from '../modal/modalSlice';
import { addToCart } from '../cart/cartSlice';
import { clearSelectedDeck } from '..';

export interface DeckDetailsButtonProps {
    deck: Deck;
    isOwned: boolean;
}

const DeckDetailsButton: React.FC<DeckDetailsButtonProps> = ({ isOwned, deck }) => {
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector(isLoggedIn)
    const isGuest = useAppSelector(selectIsGuest);
    const buttonText = isOwned ? 'Play Deck' : deck.purchase_price

    const addToCartThenGoToAuth = () => {
        dispatch(addToCart(deck))
        dispatch(setFullModal('login'))
    }

    const addToCartThenGoToCheckout = () => {
        // check if guest account. Redirect if true.
        if (isGuest) {
            dispatch(clearSelectedDeck())
            dispatch(setFullModal('guestAccountRedirect'))
        } else {
            dispatch(addToCart(deck))
            dispatch(setFullModal("choosePaymentMethod"))
        }

    }

    let handler: (e: React.MouseEvent) => void;
    if (isOwned) {
        handler = () => {
            loggedIn ? dispatch(createGame(deck.id)) : dispatch(setFullModal('preGameAuth'))
        }
    } else {
        handler = () => {
            loggedIn ? addToCartThenGoToCheckout() : addToCartThenGoToAuth()
        }
    }
    return (
        loggedIn ? <Button type="button" onClick={handler}>{buttonText}</Button> : <Button type="button" onClick={handler}>{buttonText}</Button>
    )

}

export default DeckDetailsButton;