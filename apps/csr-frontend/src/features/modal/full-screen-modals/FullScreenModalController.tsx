import { Suspense, lazy } from 'react';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Modal, NoFlexBox } from '@whosaidtrue/ui';
import { selectFullModal, setFullModal } from "../modalSlice";
import Loading from '../../loading/Loading';

// Lazy load modals
const CreditCardForm = lazy(() => import('./CreditCardForm'));
const CheckoutModal = lazy(() => import('./CheckoutModal'));
const DeckDetailsModal = lazy(() => import('./DeckDetailsModal'));
const RedeemCredits = lazy(() => import('./RedeemCredits'));
const PreGameAuth = lazy(() => import('./PreGameAuth'));
const GuestRedirect = lazy(() => import('./GuestAccountRedirect'));
const Login = lazy(() => import('../../auth/Login'));
const CreateAccount = lazy(() => import('../../auth/CreateAccount'))




const FullScreenModalController = () => {
    const dispatch = useAppDispatch();
    const currentModal = useAppSelector(selectFullModal);

    const close = () => {
        dispatch(setFullModal(''))
    }

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
                <NoFlexBox className="w-80 pt-7 md:w-28rem" >
                    <Suspense fallback={<Loading />}>
                        <CheckoutModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Credit card */}
            {currentModal === 'cardPurchase' && <Modal
                isOpen={currentModal === 'cardPurchase'}
                onRequestClose={close}
                shouldCloseOnOverlayClick={true}>
                <NoFlexBox className="w-80 md:w-28rem">
                    <Suspense fallback={<Loading />}>
                        <CreditCardForm />
                    </Suspense>
                </NoFlexBox>
            </Modal>
            }

            {/* Free Deck Credit Purchase*/}
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
        </>





    )
}

export default FullScreenModalController;



            // {/* Game Options */}
            // {isGameOptionsOpen && <Modal isOpen={isGameOptionsOpen} onRequestClose={close}>
            //     <div className={`
            //         bg-white-ish
            //         border-0
            //         rounded-3xl
            //         px-2
            //         py-2
            //         sm:py-6
            //         sm:px-8
            //         filter
            //         drop-shadow-card
            //         text-center
            //         sm:w-28rem
            //         md:w-40rem
            //         `}>
            //         <GameOptionsModal />
            //     </div>
            // </Modal>}


            // {/* Confirm Leave Game */}
            // {isConfirmLeaveGameOpen && <Modal isOpen={isConfirmLeaveGameOpen} onRequestClose={close}>
            //     <NoFlexBox>
            //         <Suspense fallback={<Loading />}>
            //             <ConfirmEndGameModal />
            //         </Suspense>
            //     </NoFlexBox>
            // </Modal>}

            // {/* Confirm End Game */}
            // {isConfirmEndGameOpen && <Modal isOpen={isConfirmEndGameOpen} onRequestClose={close}>
            //     <NoFlexBox>
            //         <Suspense fallback={<Loading />}>
            //             <ConfirmEndGameModal />
            //         </Suspense>
            //     </NoFlexBox>
            // </Modal>}

            // {/* Remove Players */}
            // {isRemovePlayersOpen && <Modal isOpen={isRemovePlayersOpen} onRequestClose={close}>
            //     <Suspense fallback={<Loading />}>
            //         <RemovePlayersModal />
            //     </Suspense>
            // </Modal>}

            // {/* Confirm Remove Player */}
            // {isConfirmRemovePlayerOpen && <Modal isOpen={isConfirmRemovePlayerOpen} onRequestClose={close}>
            //     <NoFlexBox className="text-basic-black text-center sm:w-28rem md:w-40rem">
            //         <Suspense fallback={<Loading />}>
            //             <ConfirmRemovePlayerModal />
            //         </Suspense>
            //     </NoFlexBox>
            // </Modal>}

            // {/* Removed From Game Notification */}
            // {isRemovedNotificationOpen && <Modal isOpen={isRemovedNotificationOpen} onRequestClose={close}>
            //     <NoFlexBox>
            //         <Suspense fallback={<Loading />}>
            //             <ConfirmEndGameModal />
            //         </Suspense>
            //     </NoFlexBox>
            // </Modal>}

            // {/* Report an issue */}
            // {isReportAnIssueOpen && <Modal isOpen={isReportAnIssueOpen} onRequestClose={close}>
            //     <Box boxstyle="white" className="w-28rem">
            //         <Suspense fallback={<Loading />}>
            //             <ReportAnIssueModal />
            //         </Suspense>
            //     </Box>
            // </Modal>}