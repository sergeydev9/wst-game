import { Suspense, lazy } from 'react';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Modal, NoFlexBox, Box, ModalContent } from '@whosaidtrue/ui';
import { selectFullModal, setFullModal } from "./modalSlice";
import Loading from '../loading/Loading';

// Lazy load modals
const Checkout = lazy(() => import('./full-screen-modals/Checkout'));
const ChoosePaymentMethod = lazy(() => import('./full-screen-modals/ChoosePaymentMethod'));
const DeckDetailsModal = lazy(() => import('./full-screen-modals/DeckDetailsModal'));
const ConfirmFreeCreditPurchase = lazy(() => import('./full-screen-modals/ConfirmFreeCreditPurchase'));
const PreGameAuth = lazy(() => import('./full-screen-modals/PreGameAuth'));
const GuestRedirect = lazy(() => import('./full-screen-modals/GuestAccountRedirect'));
const Login = lazy(() => import('../auth/Login'));
const CreateAccount = lazy(() => import('../auth/CreateAccount'));
const ConfirmEndGameModal = lazy(() => import('./full-screen-modals/ConfirmEndGameModal'));
const RemovePlayersModal = lazy(() => import('./full-screen-modals/RemovePlayersModal'));
const ReportAnIssueModal = lazy(() => import('./full-screen-modals/ReportAnIssueModal'));
const ConfirmRemovePlayerModal = lazy(() => import('./full-screen-modals/ConfirmRemovePlayerModal'));
const GameOptionsModal = lazy(() => import('./full-screen-modals/GameOptionsModal'));

/**
 * All full screen modals render from here. This makes it possible to
 * open and close modals without having to re-render other components
 * in the current page.
 *
 */
const FullScreenModalController = () => {
    const dispatch = useAppDispatch();
    const currentModal = useAppSelector(selectFullModal);

    const close = () => {
        dispatch(setFullModal(''))
    }

    //TODO: Re-do the styling here to use the ModalContent ui component
    // instead of Box or NoFlexBox containers. See
    // remove players modal for an example.
    return (
        <>
            {/* Deck Details */}
            {currentModal === 'deckDetails' && <Modal
                isOpen={currentModal === 'deckDetails'}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <Suspense fallback={<Loading />}>
                    <DeckDetailsModal />
                </Suspense>
            </Modal>}

            {/* Guest Account Redirect */}
            {currentModal === 'guestAccountRedirect' && <Modal
                isOpen={currentModal === 'guestAccountRedirect'}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <Suspense fallback={<Loading />}>
                    <GuestRedirect />
                </Suspense>
            </Modal>
            }

            {/* Choose Payment Method */}
            {currentModal === 'choosePaymentMethod' && <Modal
                isOpen={currentModal === 'choosePaymentMethod'}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <Suspense fallback={<Loading />}>
                    <ChoosePaymentMethod />
                </Suspense>
            </Modal>}

            {/* Credit card */}
            {currentModal === 'checkout' && <Modal
                isOpen={currentModal === 'checkout'}
                onRequestClose={close}
                shouldCloseOnOverlayClick={false}>
                <Suspense fallback={<Loading />}>
                    <Checkout />
                </Suspense>
            </Modal>
            }

            {/* Free Deck Credit Purchase confirm*/}
            {currentModal === 'freeCreditPurchase' && <Modal
                isOpen={currentModal === 'freeCreditPurchase'}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <Suspense fallback={<Loading />}>
                    <ConfirmFreeCreditPurchase />
                </Suspense>
            </Modal>}

            {/* pre-game auth (user isn't logged and tries to start a game with a free deck)*/}
            {currentModal === 'preGameAuth' && <Modal
                isOpen={currentModal === 'preGameAuth'}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <Suspense fallback={<Loading />}>
                    <PreGameAuth />
                </Suspense>
            </Modal>}

            {currentModal === 'login' && <Modal
                isOpen={currentModal === 'login'} onRequestClose={close}>
                <ModalContent $narrow>
                    <Suspense fallback={<Loading />}>
                        <Login />
                    </Suspense>
                </ModalContent>
            </Modal>}

            {currentModal === 'createAccount' &&
                <Modal isOpen={currentModal === 'createAccount'}
                    onRequestClose={close}>
                    <ModalContent>
                        <Suspense fallback={<Loading />}>
                            <CreateAccount />
                        </Suspense>
                    </ModalContent>
                </Modal>}


            {/* Game Options */}
            {currentModal === 'gameOptions' && <Modal isOpen={currentModal === 'gameOptions'} onRequestClose={close}>
                <Suspense fallback={<Loading />}>
                    <GameOptionsModal />
                </Suspense>
            </Modal>}


            {/* Confirm Leave Game TODO make this */}
            {/* {currentModal === 'confirmLeaveGame' && <Modal isOpen={currentModal === 'confirmLeaveGame'} onRequestClose={close}>
                <NoFlexBox>
                    <Suspense fallback={<Loading />}>
                        <ConfirmEndGameModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>} */}

            {/* Confirm End Game */}
            {currentModal === 'confirmEndGame' && <Modal isOpen={currentModal === 'confirmEndGame'} onRequestClose={close}>
                <Suspense fallback={<Loading />}>
                    <ConfirmEndGameModal />
                </Suspense>
            </Modal>}

            {/* Remove Players */}
            {currentModal === 'removePlayers' && <Modal isOpen={currentModal === 'removePlayers'} onRequestClose={close}>
                <Suspense fallback={<Loading />}>
                    <RemovePlayersModal />
                </Suspense>
            </Modal>}

            {/* Confirm Remove Player */}
            {currentModal === 'confirmRemovePlayer' && <Modal isOpen={currentModal === 'confirmRemovePlayer'} onRequestClose={close}>
                <Suspense fallback={<Loading />}>
                    <ConfirmRemovePlayerModal />
                </Suspense>
            </Modal>}

            {/* Removed From Game Notification */}
            {/* {currentModal === 'removedFromGame' && <Modal isOpen={currentModal === 'removedFromGame'} onRequestClose={close}>
                <NoFlexBox>
                    <Suspense fallback={<Loading />}>
                        <ConfirmEndGameModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>} */}

            {/* Report an issue */}
            {currentModal === 'reportAnIssue' && <Modal isOpen={currentModal === 'reportAnIssue'} onRequestClose={close}>
                <Suspense fallback={<Loading />}>
                    <ReportAnIssueModal />
                </Suspense>
            </Modal>}
        </>
    )
}

export default FullScreenModalController;