import { Button } from '@whosaidtrue/ui'
import { types } from '@whosaidtrue/api-interfaces';

import { showError } from '../../modal/modalSlice';
import { useAppDispatch } from '../../../app/hooks';
import useSocket from '../../socket/useSocket';

const StartNextQuestion: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sendMessage } = useSocket();

    const handler = () => {
        sendMessage(types.START_NEXT_QUESTION, undefined, (ack) => {
            if (ack === 'error') {
                dispatch(showError('Oops, something went wrong...'));
            }
        })
    }

    return <Button onClick={handler}>Next Question</Button>

}

export default StartNextQuestion;