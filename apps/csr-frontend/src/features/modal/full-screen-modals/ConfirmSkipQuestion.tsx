import { useEffect } from 'react';
import { Button, Title1, BodyMedium, ModalContent } from '@whosaidtrue/ui';
import { types, payloads } from '@whosaidtrue/api-interfaces';
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import useSocket from '../../socket/useSocket';
import { setFullModal, showError } from '../modalSlice';
import { selectGamequestionId, selectIsLastQuestion } from '../../question/questionSlice';

const ConfirmSkipQuestion: React.FC = () => {
    const dispatch = useAppDispatch()
    const { sendMessage } = useSocket();
    const gameQuestionId = useAppSelector(selectGamequestionId);
    const isLastQuestion = useAppSelector(selectIsLastQuestion);

    const skip = () => {
        const message: payloads.QuestionSkip = {
            gameQuestionId
        }
        sendMessage(types.SKIP_QUESTION, message, ack => {
            if (ack === 'error') {
                dispatch(showError('An error occured while skipping question'))

            } else if (!isLastQuestion) { // without this check, the winner announcement instantly closes for the host
                dispatch(setFullModal(''))
            }
        });
    }

    return (
        <ModalContent>
            <Title1 className="mb-8 mt-2 text-center">Are you sure you awant to skip this question?</Title1>
            <BodyMedium >The game will have one less question.</BodyMedium>
            <div className="md:w-3/5 my-10 flex flex-col gap-4 mx-auto">
                <Button onClick={skip} type="button">Yes</Button>
                <Button className="w-full" onClick={() => dispatch(setFullModal(''))} type="button" $secondary>No</Button>
            </div>
        </ModalContent>
    )
}

export default ConfirmSkipQuestion;