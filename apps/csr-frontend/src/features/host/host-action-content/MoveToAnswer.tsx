import { Button } from '@whosaidtrue/ui'
import { payloads, types } from '@whosaidtrue/api-interfaces';
import { showError } from '../../modal/modalSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import useSocket from '../../socket/useSocket';
import { selectQuestionId } from '../..';


const MoveToAnswer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sendMessage } = useSocket();
    const gameQuestionId = useAppSelector(selectQuestionId)

    const handler = () => {
        sendMessage(types.MOVE_TO_ANSWER, { gameQuestionId } as payloads.QuestionSkip, (ack) => {
            if (ack === 'error') {
                dispatch(showError('Oops, something went wrong...'))
            }
        })
    }

    return <Button onClick={handler}>Skip to Results</Button>


}

export default MoveToAnswer;