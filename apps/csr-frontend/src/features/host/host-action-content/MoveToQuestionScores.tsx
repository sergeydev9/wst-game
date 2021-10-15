import { Button } from '@whosaidtrue/ui'
import { types } from '@whosaidtrue/api-interfaces';

import { showError } from '../../modal/modalSlice';
import { useAppDispatch } from '../../../app/hooks';
import useSocket from '../../socket/useSocket';


const MoveToQuestionScores: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sendMessage } = useSocket();

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
            <Button onClick={handler}>See Scores</Button>
        </>
    )
}

export default MoveToQuestionScores;