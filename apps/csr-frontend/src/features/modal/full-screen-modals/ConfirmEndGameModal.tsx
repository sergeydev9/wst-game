import { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import useSocket from '../../socket/useSocket';
import { Title1, Button, BodyMedium, ModalContent } from '@whosaidtrue/ui';
import { clearGame, selectIsHost } from '../../game/gameSlice';
import { setFullModal, showError } from '../../modal/modalSlice';

const ConfirmEndGameModal: React.FC = () => {
    const dispatch = useAppDispatch()
    const history = useHistory();
    const isHost = useAppSelector(selectIsHost);
    const { socket, setSocket } = useSocket()

    useEffect(() => {

        if (!isHost) {
            dispatch(setFullModal(''))
        }

        if (!socket) {
            dispatch(showError('No connnection to game server. Check your internet connection and try again'))
        }
    }, [isHost, dispatch, socket])

    const endGame = useCallback(() => {
        socket?.emit("EndGame");
        dispatch(clearGame); // TODO: remove when socket implentation completes this response
        socket?.close();
        dispatch(setFullModal(''));
        dispatch(clearGame());
        setSocket(null);
        history.push('/')
    }, [dispatch, socket, history, setSocket])


    return (
        <ModalContent>
            <Title1 className="text-center mt-1 mb-10">End Game</Title1>
            <div className="flex place-items-center flex-col gap-6 w-28rem">
                <BodyMedium className="text-center mb-4">Are you sure you want to end the game for all players and see final scores?</BodyMedium>
                <div className="px-20 w-full flex flex-col gap-6">
                    <button
                        type="button"
                        onClick={endGame}
                        className="border-2 border-destructive text-destructive text-label-big bg-white-ish font-bold rounded-full py-3 w-full text-center hover:bg-destructive hover:text-white-ish">
                        Yes
                    </button>
                    <Button className="w-full mb-10" onClick={() => dispatch(setFullModal(''))} $secondary>No</Button>
                </div>

            </div>


        </ModalContent>)
}

export default ConfirmEndGameModal;