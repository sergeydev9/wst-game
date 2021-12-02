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
    const screen = useAppSelector(currentScreen);

    useEffect(() => {

        if (screen === 'waitingRoom' && !timer) {
            const THIRTY_SECONDS = 1000 * 30;

            const time = setTimeout(() => {
                dispatch(setShowTakingTooLong(true));
            }, THIRTY_SECONDS);
            setTimer(time);
        }

        return () => {
            dispatch(setShowTakingTooLong(false));

            if (timer) {
                clearTimeout(timer);
                setTimer(null);
            }
        }
    }, [timer, dispatch, screen]);


    return (
        <HostActionsBox>
            {gameStatus === 'lobby' && <StartGame />}
            {screen === 'answerSubmit' && <DuringQuestion />}
            {screen === 'waitingRoom' && gameStatus === 'inProgress' && <MoveToAnswer />}
            {screen === 'answerResults' && <MoveToQuestionScores />}
            {screen === 'scoreResults' && gameStatus !== 'lobby' && <StartNextQuestion />}
        </HostActionsBox>
    )
}

export default HostActions;