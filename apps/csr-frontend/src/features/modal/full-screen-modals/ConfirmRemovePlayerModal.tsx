import { useEffect } from 'react';
import { Button, Title1, BodyMedium, ModalContent } from '@whosaidtrue/ui';
import { types, payloads } from '@whosaidtrue/api-interfaces';
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import useSocket from '../../socket/useSocket';
import { selectTargetName, clearTarget, selectTargetId } from "../../host/hostSlice";
import { selectGameStatus } from '../../game/gameSlice';
import { setFullModal, showError } from '../modalSlice';

const ConfirmRemovePlayerModal: React.FC = () => {
    const dispatch = useAppDispatch()
    const { sendMessage } = useSocket();
    const targetName = useAppSelector(selectTargetName);
    const targetId = useAppSelector(selectTargetId);
    const gameStatus = useAppSelector(selectGameStatus);

    useEffect(() => {
        return () => {
            dispatch(clearTarget())
        }
    }, [dispatch])

    const removePlayer = () => {

        // if there was an error, show an error message.
        // If this succeeds, the host will receive a success event from the server,
        // which triggers success notification.
        // Either way, close the modal after confirmation.
        sendMessage(
            types.REMOVE_PLAYER,
            {
                id: targetId,
                player_name: targetName,
                event_origin: gameStatus === 'lobby' ? 'lobby' : 'game'
            } as payloads.PlayerEvent, ack => {
                if (ack !== 'ok') {
                    dispatch(showError('Could not remove that player from the game'));
                }
            });
        dispatch(setFullModal(''));


    }

    return (
        <ModalContent>
            <Title1 className="mb-8 mt-2">Remove Player?</Title1>
            <BodyMedium >Are you sure you want to remove</BodyMedium>
            <h3 className='font-black text-2xl'>{targetName}</h3>
            <div className="md:w-3/5 my-10 flex flex-col gap-4 mx-auto">
                <Button onClick={removePlayer} type="button">Yes, remove player</Button>
                <Button className="w-full" onClick={() => dispatch(setFullModal(''))} type="button" $secondary>Cancel</Button>
            </div>
        </ModalContent>
    )
}

export default ConfirmRemovePlayerModal;