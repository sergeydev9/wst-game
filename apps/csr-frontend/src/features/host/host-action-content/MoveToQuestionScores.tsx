import { useEffect, useState } from 'react';
import { Button } from '@whosaidtrue/ui'
import { types } from '@whosaidtrue/api-interfaces';
import { showError } from '../../modal/modalSlice';
import { useAppDispatch } from '../../../app/hooks';
import useSocket from '../../socket/useSocket';

/**
 * Shows a button to move the game to the question scores.
 * Button will begin to pulse after 20 seconds.
 */
const MoveToQuestionScores: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sendMessage } = useSocket();
    const [pulseTimer, setPulseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [pulsing, setPulsing] = useState<boolean>(false);

    useEffect(() => {

        if (!pulseTimer) {
            const pTime = setTimeout(() => setPulsing(true), 20000); // start pulsing after 20 seconds
            setPulseTimer(pTime);
        }

        return () => {

            if (pulseTimer) {
                clearTimeout(pulseTimer);
                setPulseTimer(null);
            }
        }
    }, [pulseTimer])

    const handler = () => {
        sendMessage(types.MOVE_TO_QUESTION_RESULTS, undefined, (ack) => {
            if (ack === 'error') {
                dispatch(showError('Oops, something went wrong...'))
            }
        })
    }

    return (
        <>
            <h3 className="text-center font-bold text-basic-black">Move the group to the Scoreboard when ready</h3>
            <div className="w-80 mx-auto">
                <div className="flex w-full h-max relative">
                    <span className={`${pulsing ? 'animate-ping-slow-small' : ''} bg-blue-base inline-flex rounded-3xl absolute h-full w-full opacity-75`}></span>
                    <Button className="h-full w-full" onClick={handler}>See Scores</Button>
                </div>
            </div>
        </>)
}

export default MoveToQuestionScores;