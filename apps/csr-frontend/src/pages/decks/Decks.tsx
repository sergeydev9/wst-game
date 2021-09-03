import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    DeckSelection,
    DeckDetailsModal,
    setFullModal,
    clearSelectedDeck,
    selectFullModalFactory,
    CheckoutModal,
    CreditCardForm,
    RedeemCredits
} from '../../features';
import { Modal, NoFlexBox, } from '@whosaidtrue/ui'
import { clearCart } from '../../features/cart/cartSlice';

const Decks: React.FC = () => {

    const dispatch = useAppDispatch();
    const isDetailsOpen = useAppSelector(selectFullModalFactory('deckDetails'))
    const isChoosePaymentOpen = useAppSelector(selectFullModalFactory('choosePaymentMethod'))
    const isCardPaymentOpen = useAppSelector(selectFullModalFactory('cardPurchase'))
    const isDeckCreditOpen = useAppSelector(selectFullModalFactory('freeCreditPurchase'))

    const closeDetails = () => {
        dispatch(setFullModal(''))
        dispatch(clearSelectedDeck())
    }

    const close = () => {
        dispatch(setFullModal(''))
    }

    const closeAndClearCart = () => {
        dispatch(setFullModal(''))
        dispatch(clearCart());
    }

    return (
        <>
            <DeckSelection />

            {/* Deck Details */}
            <Modal
                isOpen={isDetailsOpen}
                onRequestClose={closeDetails}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80 md:w-28rem">
                    <DeckDetailsModal />
                </NoFlexBox>
            </Modal>

            {/* Choose Payment Method */}
            <Modal
                isOpen={isChoosePaymentOpen}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-28rem">
                    <CheckoutModal />
                </NoFlexBox>
            </Modal>

            {/* Credit card */}
            <Modal
                isOpen={isCardPaymentOpen}
                onRequestClose={closeAndClearCart}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-28rem">
                    <CreditCardForm />
                </NoFlexBox>
            </Modal>

            {/* Deck Credit */}
            <Modal
                isOpen={isDeckCreditOpen}
                onRequestClose={closeAndClearCart}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-max">
                    <RedeemCredits />
                </NoFlexBox>
            </Modal>
        </>
    )
}

export default Decks;