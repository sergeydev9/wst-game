import { Suspense, lazy } from 'react';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Modal, NoFlexBox, Box } from '@whosaidtrue/ui';
import { selectFullModal, setFullModal } from "../modalSlice";
import Loading from '../../loading/Loading';

// Lazy load modals
const Checkout = lazy(() => import('./Checkout'));
const ChoosePaymentMethod = lazy(() => import('./ChoosePaymentMethod'));
const DeckDetailsModal = lazy(() => import('./DeckDetailsModal'));
const RedeemCredits = lazy(() => import('./RedeemCredits'));
const PreGameAuth = lazy(() => import('./PreGameAuth'));
const GuestRedirect = lazy(() => import('./GuestAccountRedirect'));
const Login = lazy(() => import('../../auth/Login'));
const CreateAccount = lazy(() => import('../../auth/CreateAccount'));
const ConfirmEndGameModal = lazy(() => import('./ConfirmEndGameModal'));
const RemovePlayersModal = lazy(() => import('./RemovePlayersModal'));
const ReportAnIssueModal = lazy(() => import('./ReportAnIssueModal'));
const ConfirmRemovePlayerModal = lazy(() => import('./ConfirmRemovePlayerModal'));
const GameOptionsModal = lazy(() => import('./GameOptionsModal'));

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
                <NoFlexBox className="w-80 md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <DeckDetailsModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Guest Account Redirect */}
            {currentModal === 'guestAccountRedirect' && <Modal
                isOpen={currentModal === 'guestAccountRedirect'}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80 md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <GuestRedirect />
                    </Suspense>
                </NoFlexBox>
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
                <NoFlexBox className="w-80  md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <RedeemCredits />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* pre-game auth (user isn't logged and tries to start a game with a free deck)*/}
            {currentModal === 'preGameAuth' && <Modal
                isOpen={currentModal === 'preGameAuth'}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80 md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <PreGameAuth />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {currentModal === 'login' && <Modal
                isOpen={currentModal === 'login'} onRequestClose={close}>
                <NoFlexBox className="w-96">
                    <Suspense fallback={<Loading />}>
                        <Login />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {currentModal === 'createAccount' &&
                <Modal isOpen={currentModal === 'createAccount'}
                    onRequestClose={close}>
                    <NoFlexBox className="w-28rem">
                        <Suspense fallback={<Loading />}>
                            <CreateAccount />
                        </Suspense>
                    </NoFlexBox>
                </Modal>}


            {/* Game Options */}
            {currentModal === 'gameOptions' && <Modal isOpen={currentModal === 'gameOptions'} onRequestClose={close}>
                <div className={`
                    bg-white-ish
                    border-0
                    rounded-3xl
                    px-2
                    py-2
                    sm:py-6
                    sm:px-8
                    filter
                    drop-shadow-card
                    text-center
                    sm:w-28rem
                    md:w-40rem
                    `}>
                    <GameOptionsModal />
                </div>
            </Modal>}


            {/* Confirm Leave Game */}
            {currentModal === 'confirmLeaveGame' && <Modal isOpen={currentModal === 'confirmLeaveGame'} onRequestClose={close}>
                <NoFlexBox>
                    <Suspense fallback={<Loading />}>
                        <ConfirmEndGameModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Confirm End Game */}
            {currentModal === 'confirmEndGame' && <Modal isOpen={currentModal === 'confirmEndGame'} onRequestClose={close}>
                <NoFlexBox>
                    <Suspense fallback={<Loading />}>
                        <ConfirmEndGameModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Remove Players */}
            {currentModal === 'removePlayers' && <Modal isOpen={currentModal === 'removePlayers'} onRequestClose={close}>
                <Suspense fallback={<Loading />}>
                    <RemovePlayersModal />
                </Suspense>
            </Modal>}

            {/* Confirm Remove Player */}
            {currentModal === 'confirmRemovePlayer' && <Modal isOpen={currentModal === 'confirmRemovePlayer'} onRequestClose={close}>
                <NoFlexBox className="text-basic-black text-center sm:w-28rem md:w-40rem">
                    <Suspense fallback={<Loading />}>
                        <ConfirmRemovePlayerModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Removed From Game Notification */}
            {currentModal === 'removedFromGame' && <Modal isOpen={currentModal === 'removedFromGame'} onRequestClose={close}>
                <NoFlexBox>
                    <Suspense fallback={<Loading />}>
                        <ConfirmEndGameModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Report an issue */}
            {currentModal === 'reportAnIssue' && <Modal isOpen={currentModal === 'reportAnIssue'} onRequestClose={close}>
                <Box boxstyle="white" className="w-28rem">
                    <Suspense fallback={<Loading />}>
                        <ReportAnIssueModal />
                    </Suspense>
                </Box>
            </Modal>}
        </>
    )
}

export default FullScreenModalController;