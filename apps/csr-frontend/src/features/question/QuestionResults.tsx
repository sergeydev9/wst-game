import { useEffect } from "react";
import { Scoreboard, QuestionScores } from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    selectCorrectAnswer,
    selectGuessValue,
    selectPlayerScore,
    selectScoreboard,
    selectSequenceIndex,
    selectPlayerPointsEarned
} from "./questionSlice";
import { selectScoreTooltipDismissed, setShowScoreTooltip } from "../modal/modalSlice";

const QuestionResults: React.FC = () => {
    const dispatch = useAppDispatch();
    const tooltipDismissed = useAppSelector(selectScoreTooltipDismissed);
    const playerScore = useAppSelector(selectPlayerScore);
    const correctAnswer = useAppSelector(selectCorrectAnswer);
    const guess = useAppSelector(selectGuessValue);
    const scoreboard = useAppSelector(selectScoreboard);
    const points = useAppSelector(selectPlayerPointsEarned);
    const index = useAppSelector(selectSequenceIndex);

    useEffect(() => {
        if (!tooltipDismissed) {
            dispatch(setShowScoreTooltip(true))
        }
        return () => {
            dispatch(setShowScoreTooltip(false))
        }
    }, [tooltipDismissed, dispatch])

    // TODO: put an error boundary here
    return (
        <QuestionScores guess={guess} correctAnswer={correctAnswer} pointsEarned={points}>
            <Scoreboard scores={scoreboard} showDiff={index !== 1} currentPlayerScore={playerScore} />
        </QuestionScores>

    )
}

export default QuestionResults;