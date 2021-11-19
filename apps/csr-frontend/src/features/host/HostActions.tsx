import { useEffect, useState } from 'react';
import { HostActions as HostActionsBox } from "@whosaidtrue/ui";
import { selectGameStatus } from "../game/gameSlice";
import { currentScreen, selectQuestionStatus } from "../question/questionSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import StartGame from './host-action-content/StartGame';
import DuringQuestion from './host-action-content/DuringQuestion';
import MoveToAnswer from './host-action-content/MoveToAnswer';
import MoveToQuestionScores from "./host-action-content/MoveToQuestionScores";
import StartNextQuestion from "./host-action-content/StartNextQuestion";
import { setShowTakingTooLong } from '../modal/modalSlice';

const HostActions: React.FC = () => {
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const dispatch = useAppDispatch();
    const gameStatus = useAppSelector(selectGameStatus);
    const questionStatus = useAppSelector(selectQuestionStatus);
    const screen = useAppSelector(currentScreen);

    useEffect(() => {

        dispatch(setShowTakingTooLong(true))

        return () => {
            if (timer) {
                setTimer(null);
            }
        }
    }, [timer, dispatch])

    const isRequired = (gameStatus === 'lobby' || questionStatus === 'results' || questionStatus === 'answer' || screen === 'answerResults' || screen === 'scoreResults')

    return (
        <HostActionsBox required={isRequired}>
            {gameStatus === 'lobby' && <StartGame />}
            {screen === 'answerSubmit' && <DuringQuestion />}
            {screen === 'waitingRoom' && gameStatus === 'inProgress' && <MoveToAnswer />}
            {screen === 'answerResults' && <MoveToQuestionScores />}
            {screen === 'scoreResults' && gameStatus !== 'lobby' && <StartNextQuestion />}
        </HostActionsBox>
    )
}

export default HostActions;