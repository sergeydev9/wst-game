import { Scoreboard, QuestionScores } from "@whosaidtrue/ui";
import { selectPlayerPointsEarned } from "..";
import { useAppSelector } from "../../app/hooks";
import { selectCorrectAnswer, selectGuessValue, selectPlayerScore, selectScoreboard } from "./questionSlice";

const QuestionResults: React.FC = () => {
    const playerScore = useAppSelector(selectPlayerScore);
    const correctAnswer = useAppSelector(selectCorrectAnswer);
    const guess = useAppSelector(selectGuessValue);
    const scoreboard = useAppSelector(selectScoreboard);
    const points = useAppSelector(selectPlayerPointsEarned)

    // TODO: put an error boundary here
    return (
        <QuestionScores guess={guess} correctAnswer={correctAnswer} pointsEarned={points}>
            <Scoreboard scores={scoreboard} showDiff={true} currentPlayerScore={playerScore} />
        </QuestionScores>

    )
}

export default QuestionResults;