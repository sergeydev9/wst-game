import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    DeckSelection,
    DeckDetailsModal,
    setFullModal,
    clearSelectedDeck,
    selectFullModalFactory,
    CheckoutModal,
    CreditCardForm
} from '../../features';
import { Modal, NoFlexBox, } from '@whosaidtrue/ui'

const Decks: React.FC = () => {

    const dispatch = useAppDispatch();
    const isDetailsOpen = useAppSelector(selectFullModalFactory('deckDetails'))
    const isChoosePaymentOpen = useAppSelector(selectFullModalFactory('choosePaymentMethod'))
    const isCardPaymentOpen = useAppSelector(selectFullModalFactory('cardPurchase'))
    const isGooglePayOpen = useAppSelector(selectFullModalFactory('googlePay'))
    const isDeckCreditOpen = useAppSelector(selectFullModalFactory('freeCreditPurchase'))



    const closeDetails = () => {
        dispatch(setFullModal(''))
        dispatch(clearSelectedDeck())
    }

    const close = () => {
        dispatch(setFullModal(''))
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
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-28rem">
                    <CreditCardForm />
                </NoFlexBox>
            </Modal>

            {/* Deck Credit */}
            <Modal
                isOpen={isDeckCreditOpen}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-28rem">
                    <CreditCardForm />
                </NoFlexBox>
            </Modal>
        </>
    )
}

export default Decks;