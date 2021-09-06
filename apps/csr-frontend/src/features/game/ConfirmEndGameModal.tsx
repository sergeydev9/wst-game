import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Title1, Button, BodyMedium } from '@whosaidtrue/ui';
import { selectIsHost, sendEndGameSignal } from './gameSlice';
import { setFullModal } from '..';

const ConfirmEndGameModal: React.FC = () => {
    const dispatch = useAppDispatch()
    const history = useHistory();
    const isHost = useAppSelector(selectIsHost);

    useEffect(() => {
        if (!isHost) {
            dispatch(setFullModal(''))
        }
    }, [isHost, dispatch])

    const endGame = () => {
        dispatch(sendEndGameSignal())
        history.push('/game/results')
    }

    return (
        <>
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


        </>)
}

export default ConfirmEndGameModal;