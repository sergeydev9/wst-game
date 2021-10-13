import { HostActions as HostActionsBox } from "@whosaidtrue/ui";
import { selectGameStatus } from "../game/gameSlice";
import { selectQuestionStatus } from "../question/questionSlice";
import { useAppSelector } from "../../app/hooks";
import StartGame from './host-action-content/StartGame';
import DuringQuestion from './host-action-content/DuringQuestion';

const HostActions: React.FC = () => {
    const gameStatus = useAppSelector(selectGameStatus);
    const questionStatus = useAppSelector(selectQuestionStatus);

    const isRequired = (gameStatus === 'lobby' || questionStatus === 'results')

    return (
        <HostActionsBox required={isRequired}>
            {gameStatus === 'lobby' && <StartGame />}
            {gameStatus === 'inProgress' && questionStatus === "question" && <DuringQuestion />}
        </HostActionsBox>
    )
}

export default HostActions;