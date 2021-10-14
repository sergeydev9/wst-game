import { HostActions as HostActionsBox } from "@whosaidtrue/ui";
import { selectGameStatus } from "../game/gameSlice";
import { currentScreen, selectQuestionStatus } from "../question/questionSlice";
import { useAppSelector } from "../../app/hooks";
import StartGame from './host-action-content/StartGame';
import DuringQuestion from './host-action-content/DuringQuestion';
import MoveToAnswer from './host-action-content/MoveToAnswer';
import MoveToQuestionScores from "./host-action-content/MoveToQuestionScores";
import StartNextQuestion from "./host-action-content/StartNextQuestion";

const HostActions: React.FC = () => {
    const gameStatus = useAppSelector(selectGameStatus);
    const questionStatus = useAppSelector(selectQuestionStatus);
    const screen = useAppSelector(currentScreen);

    const isRequired = (gameStatus === 'lobby' || questionStatus === 'results' || questionStatus === 'answer')

    return (
        <HostActionsBox required={isRequired}>
            {gameStatus === 'lobby' && <StartGame />}
            {screen === 'answerSubmit' && <DuringQuestion />}
            {screen === 'waitingRoom' && <MoveToAnswer />}
            {screen === 'answerResults' && <MoveToQuestionScores />}
            {(screen === 'scoreResults' && gameStatus !== 'postGame') && <StartNextQuestion />}
        </HostActionsBox>
    )
}

export default HostActions;