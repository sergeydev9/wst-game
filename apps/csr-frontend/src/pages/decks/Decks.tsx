import { lazy, Suspense, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    DeckSelection,
    setFullModal,
    clearSelectedDeck,
    selectFullModalFactory,
    Loading,
    selectMessageType,
    selectMessageContent
} from '../../features';
import { Modal, NoFlexBox, } from '@whosaidtrue/ui';

// Lazy load modals
const CreditCardForm = lazy(() => import('../../features/cart/CreditCardForm'));
const CheckoutModal = lazy(() => import('../../features/cart/CheckoutModal'));
const DeckDetailsModal = lazy(() => import('../../features/decks/DeckDetailsModal'));
const RedeemCredits = lazy(() => import('../../features/cart/RedeemCredits'));
const PreGameAuth = lazy(() => import('../../features/auth/PreGameAuth'));
const GuestRedirect = lazy(() => import('../../features/auth/GuestAccountRedirect'));


const Decks: React.FC = () => {
    const dispatch = useAppDispatch();
    const isDetailsOpen = useAppSelector(selectFullModalFactory('deckDetails'))
    const isChoosePaymentOpen = useAppSelector(selectFullModalFactory('choosePaymentMethod'))
    const isCardPaymentOpen = useAppSelector(selectFullModalFactory('cardPurchase'))
    const isDeckCreditOpen = useAppSelector(selectFullModalFactory('freeCreditPurchase'))
    const isPreGameAuthOpen = useAppSelector(selectFullModalFactory('preGameAuth'))
    const isGuestRedirectOpen = useAppSelector(selectFullModalFactory('guestAccountRedirect'))

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
            {isDetailsOpen && <Modal
                isOpen={isDetailsOpen}
                onRequestClose={closeDetails}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80 md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <DeckDetailsModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Guest Account Redirect */}
            {isGuestRedirectOpen && <Modal
                isOpen={isGuestRedirectOpen}
                onRequestClose={closeDetails}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80 md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <GuestRedirect />
                    </Suspense>
                </NoFlexBox>
            </Modal>
            }

            {/* Choose Payment Method */}
            {isChoosePaymentOpen && <Modal
                isOpen={isChoosePaymentOpen}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80 pt-7 md:w-28rem" >
                    <Suspense fallback={<Loading />}>
                        <CheckoutModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Credit card */}
            {isCardPaymentOpen && <Modal
                isOpen={isCardPaymentOpen}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80 md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <CreditCardForm />
                    </Suspense>
                </NoFlexBox>
            </Modal>
            }

            {/* Free Deck Credit */}
            {isDeckCreditOpen && <Modal
                isOpen={isDeckCreditOpen}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80  md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <RedeemCredits />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* pre-game auth (user isn't logged and tries to start a game with a free deck)*/}
            {isPreGameAuthOpen && <Modal
                isOpen={isPreGameAuthOpen}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80 md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <PreGameAuth />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* error modal */}
            { }
        </>
    )
}

export default Decks;