import { lazy, Suspense } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Loading from '../loading/Loading';
import { selectPlayerName, selectAccessCode } from '../game/gameSlice';
import { Button, Modal, NoFlexBox, Box } from '@whosaidtrue/ui';
import { setFullModal, selectFullModalFactory } from '../modal/modalSlice';
import GameOptionsModal from '../game/GameOptionsModal';

const ConfirmEndGameModal = lazy(() => import('../game/ConfirmEndGameModal'));
const ReportAnIssueModal = lazy(() => import('../modal/ReportAnIssueModal'));
const ConfirmRemovePlayerModal = lazy(() => import('../game/ConfirmRemovePlayerModal'));

const InGameNav: React.FC = () => {
    const dispatch = useAppDispatch();
    const isGameOptionsOpen = useAppSelector(selectFullModalFactory('gameOptions'))
    const isConfirmEndGameOpen = useAppSelector(selectFullModalFactory('confirmEndGame'))
    const isConfirmLeaveGameOpen = useAppSelector(selectFullModalFactory('confirmLeaveGame'))
    const isRemovePlayersOpen = useAppSelector(selectFullModalFactory('removePlayers'))
    const isRemovedNotificationOpen = useAppSelector(selectFullModalFactory('removedFromGame'))
    const isReportAnIssueOpen = useAppSelector(selectFullModalFactory('reportAnIssue'))
    const isConfirmRemovePlayerOpen = useAppSelector(selectFullModalFactory('confirmRemovePlayer'))


    const name = useAppSelector(selectPlayerName);
    const accessCode = useAppSelector(selectAccessCode)

    const openGameOptions = () => {
        dispatch(setFullModal('gameOptions'))
    }

    const close = () => {
        dispatch(setFullModal(''))
    }

    // if there is a name, then show it. Otherwise show the game code
    return (
        <>
            <h2 className="text-basic-black font-extrabold relative mx-auto text-2xl leading-tight">{name ? name : `Game Code: ${accessCode}`}</h2>
            <Button type="button" buttonStyle='small' $secondary onClick={openGameOptions}>Game Options</Button>

            {/* Game Options */}
            {isGameOptionsOpen && <Modal isOpen={isGameOptionsOpen} onRequestClose={close}>
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
            {isConfirmLeaveGameOpen && <Modal isOpen={isConfirmLeaveGameOpen} onRequestClose={close}>
                <NoFlexBox>
                    <Suspense fallback={<Loading />}>
                        <ConfirmEndGameModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Confirm End Game */}
            {isConfirmEndGameOpen && <Modal isOpen={isConfirmEndGameOpen} onRequestClose={close}>
                <NoFlexBox>
                    <Suspense fallback={<Loading />}>
                        <ConfirmEndGameModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}


            {/* Remove Players */}
            {isRemovePlayersOpen && <Modal isOpen={isRemovePlayersOpen} onRequestClose={close}>
                <NoFlexBox>
                    <Suspense fallback={<Loading />}>
                        <ConfirmEndGameModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Confirm Remove Player */}
            {isConfirmRemovePlayerOpen && <Modal isOpen={isConfirmRemovePlayerOpen} onRequestClose={close}>
                <NoFlexBox className="text-basic-black text-center sm:w-28rem md:w-40rem">
                    <Suspense fallback={<Loading />}>
                        <ConfirmRemovePlayerModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Removed From Game Notification */}
            {isRemovedNotificationOpen && <Modal isOpen={isRemovedNotificationOpen} onRequestClose={close}>
                <NoFlexBox>
                    <Suspense fallback={<Loading />}>
                        <ConfirmEndGameModal />
                    </Suspense>
                </NoFlexBox>
            </Modal>}

            {/* Report an issue */}
            {isReportAnIssueOpen && <Modal isOpen={isReportAnIssueOpen} onRequestClose={close}>
                <Box boxstyle="white" className="w-28rem">
                    <Suspense fallback={<Loading />}>
                        <ReportAnIssueModal />
                    </Suspense>
                </Box>
            </Modal>}
        </>
    )
}

export default InGameNav;