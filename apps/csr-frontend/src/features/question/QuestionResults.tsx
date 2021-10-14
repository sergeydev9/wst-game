import { Scoreboard, QuestionScores } from "@whosaidtrue/ui";
import { useAppSelector } from "../../app/hooks";
import { selectCorrectAnswer, selectGuessValue, selectPlayerScore, selectScoreboard } from "./questionSlice";

const QuestionResults: React.FC = () => {
    const playerScore = useAppSelector(selectPlayerScore);
    const correctAnswer = useAppSelector(selectCorrectAnswer);
    const guess = useAppSelector(selectGuessValue);
    const scoreboard = useAppSelector(selectScoreboard);

    return (
        <QuestionScores guess={guess} correctAnswer={correctAnswer} pointsEarned={playerScore.points}>
            <Scoreboard scores={scoreboard} showDiff={true} currentPlayerScore={playerScore} />
        </QuestionScores>

    )
}

export default QuestionResults;