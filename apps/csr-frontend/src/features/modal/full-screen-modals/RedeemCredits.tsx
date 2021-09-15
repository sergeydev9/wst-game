import { useEffect } from 'react';
import { api } from '../../../api';
import { Title1, Button } from "@whosaidtrue/ui"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { setFullModal } from "../modalSlice";
import { clearCart, selectCartDeck, selectDeckId } from "../../cart/cartSlice";
import { useHistory } from 'react-router';
import { setGameDeck } from '../../game/gameSlice';

const CreditPurchase: React.FC = () => {
    const dispatch = useAppDispatch()
    const cartDeck = useAppSelector(selectCartDeck)
    const history = useHistory();

    const confirm = async (e: React.MouseEvent) => {
        e.preventDefault()
        api.post('/purchase/credits', { deckId: cartDeck.id }).then(_ => {
            dispatch(setFullModal(''))
            dispatch(setGameDeck(cartDeck))
            history.push('/purchase-success')
        }).catch(e => {
            // TODO: add a flash message error display
            console.error(e)
        })
    }

    const cancel = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(clearCart());
        dispatch(setFullModal(''))
    }

    return (
        <>
            <Title1 className="text-center mb-8 mt-1 px-8 md:px-12 text-basic-black">Purchase with Free Deck Credit?</Title1>
            <div className="px-6">
                <Button onClick={confirm}>Yes</Button>
                <Button $secondary className="w-full mt-8 mb-3" onClick={cancel}>No</Button>
            </div>

        </>
    )
}

export default CreditPurchase