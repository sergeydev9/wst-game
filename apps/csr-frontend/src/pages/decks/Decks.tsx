import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { DeckSelection, DeckDetailsModal, setFullModal, clearSelectedDeck, selectFullModalFactory, CheckoutModal } from '../../features';
import { Modal, NoFlexBox, } from '@whosaidtrue/ui'

const Decks: React.FC = () => {

    const dispatch = useAppDispatch();
    const isDetailsOpen = useAppSelector(selectFullModalFactory('deckDetails'))
    const isChoosePaymentOpen = useAppSelector(selectFullModalFactory('choosePaymentMethod'))
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
                <NoFlexBox className="w-28rem">
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
        </>
    )
}

export default Decks;