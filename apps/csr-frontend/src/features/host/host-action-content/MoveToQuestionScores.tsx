import { useEffect, useState } from 'react';
import { Button } from '@whosaidtrue/ui'
import { types } from '@whosaidtrue/api-interfaces';

import { showError } from '../../modal/modalSlice';
import { useAppDispatch } from '../../../app/hooks';
import useSocket from '../../socket/useSocket';


const MoveToQuestionScores: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sendMessage } = useSocket();

    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [pulseTimer, setPulseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [pulsing, setPulsing] = useState<boolean>(false);

    const [showActions, setShowActions] = useState(false);

    useEffect(() => {
        if (!timer) {
            const time = setTimeout(() => setShowActions(true), 5000);
            setTimer(time);
        }

        if (!pulseTimer) {
            const pTime = setTimeout(() => setPulsing(true), 20000); // start pulsing after 20 seconds
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
                setTimer(null);
            }

            if (pulseTimer) {
                clearTimeout(pulseTimer);
                setPulseTimer(null);
            }
        }
    }, [timer, pulseTimer])

    const handler = () => {
        sendMessage(types.MOVE_TO_QUESTION_RESULTS, undefined, (ack) => {
            if (ack === 'error') {
                dispatch(showError('Oops, something went wrong...'))
            }
        })
    }

    return (showActions ?
        <>
            <h3 className="text-center font-bold text-basic-black">Move the group to the Scoreboard when ready</h3>
            <span className={`${pulsing ? 'animate-ping-slow' : ''} bg-blue-base inline-flex rounded-3xl absolute opacity-75`}>
            </span>
            <Button onClick={handler}>See Scores</Button>
        </> :
        null
    )
}

export default MoveToQuestionScores;