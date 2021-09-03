import { lazy, Suspense } from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    DeckSelection,
    setFullModal,
    clearSelectedDeck,
    selectFullModalFactory,
} from '../../features';
import { Modal, NoFlexBox, } from '@whosaidtrue/ui';
import { clearCart } from '../../features/cart/cartSlice';

const CreditCardForm = lazy(() => import('../../features/cart/CreditCardForm'));
const CheckoutModal = lazy(() => import('../../features/cart/CheckoutModal'));
const DeckDetailsModal = lazy(() => import('../../features/decks/DeckDetailsModal'));
const RedeemCredits = lazy(() => import('../../features/cart/RedeemCredits'));

// TODO: make a real loading element
const Loading = () => <div>Loading...</div>;

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
                    <Suspense fallback={<Loading />}>
                        <DeckDetailsModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>

            {/* Choose Payment Method */}
            <Modal
                isOpen={isChoosePaymentOpen}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80 pt-7 lg:pt-0 md:w-28rem" >
                    <Suspense fallback={<Loading />}>
                        <CheckoutModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>

            {/* Credit card */}
            <Modal
                isOpen={isCardPaymentOpen}
                onRequestClose={closeAndClearCart}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80 md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <CreditCardForm />
                    </Suspense>
                </NoFlexBox>
            </Modal>

            {/* Deck Credit */}
            <Modal
                isOpen={isDeckCreditOpen}
                onRequestClose={closeAndClearCart}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80  md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <RedeemCredits />
                    </Suspense>
                </NoFlexBox>
            </Modal>
        </>
    )
}

export default Decks;