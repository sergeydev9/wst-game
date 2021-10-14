import { Button, Title1, BodyMedium, ModalContent } from '@whosaidtrue/ui';
import { types, payloads } from '@whosaidtrue/api-interfaces';
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import useSocket from '../../socket/useSocket';
import { setFullModal } from '../modalSlice';
import { selectPlayerName, selectPlayerId } from '../../game/gameSlice';

const ConfirmTakeOverReading: React.FC = () => {
    const dispatch = useAppDispatch()
    const { sendMessage } = useSocket();
    const playerName = useAppSelector(selectPlayerName);
    const playerId = useAppSelector(selectPlayerId);

    const takeOver = (e: React.MouseEvent) => {
        e.preventDefault();

        const message: payloads.PlayerEvent = {
            player_name: playerName,
            id: playerId
        }
        sendMessage(types.HOST_TAKE_OVER_READING, message);
        dispatch(setFullModal(''));
    }

    return (
        <ModalContent>
            <Title1 className="mb-8 mt-2 text-center">Are you sure you awant to take over reading this question?</Title1>
            <BodyMedium >Take over reading as needed to keep the game moving.</BodyMedium>
            <div className="md:w-3/5 my-10 flex flex-col gap-4 mx-auto">
                <Button onClick={takeOver} type="button">Yes</Button>
                <Button className="w-full" onClick={() => dispatch(setFullModal(''))} type="button" $secondary>No</Button>
            </div>
        </ModalContent>
    )
}

export default ConfirmTakeOverReading;