import { api } from '../../../api';
import { Title1, Button, ModalContent } from "@whosaidtrue/ui"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { setFullModal, showError } from "../modalSlice";
import { clearCart, selectCartDeck } from "../../cart/cartSlice";
import { useHistory } from 'react-router';
import { setGameDeck } from '../../game/gameSlice';

const ConfirmFreeCreditPurchase: React.FC = () => {
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
            dispatch(showError('Oops, something went wrong. Please try again later.'))
            dispatch(setFullModal(''))
        })
    }

    const cancel = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(clearCart());
        dispatch(setFullModal(''))
    }

    return (
        <ModalContent>
            <Title1 className="text-center mb-8 mt-1 px-8 md:px-12 text-basic-black">Purchase with Free Deck Credit?</Title1>
            <div className="w-2/3 sm:w-1/2">
                <Button className="w-full" onClick={confirm}>Yes</Button>
                <Button $secondary className="w-full mt-8 mb-3" onClick={cancel}>No</Button>
            </div>

        </ModalContent>
    )
}

export default ConfirmFreeCreditPurchase