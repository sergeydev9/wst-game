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
import { selectHasGuessed } from "..";
import MostSimilarToYou from "../fun-facts/MostSimilarToYou";

const QuestionResults: React.FC = () => {
    const dispatch = useAppDispatch();
    const tooltipDismissed = useAppSelector(selectScoreTooltipDismissed);
    const playerScore = useAppSelector(selectPlayerScore);
    const correctAnswer = useAppSelector(selectCorrectAnswer);
    const guess = useAppSelector(selectGuessValue);
    const hasGuessed = useAppSelector(selectHasGuessed);
    const scoreboard = useAppSelector(selectScoreboard);
    const points = useAppSelector(selectPlayerPointsEarned);
    const questionNumber = useAppSelector(selectSequenceIndex);


    useEffect(() => {
        if (!tooltipDismissed) {
            dispatch(setShowScoreTooltip(true))
        }
        return () => {
            dispatch(setShowScoreTooltip(false))
        }
    }, [tooltipDismissed, dispatch])

    return (
        <QuestionScores guess={guess} correctAnswer={correctAnswer} pointsEarned={points} hasGuessed={hasGuessed}>
            <Scoreboard scores={scoreboard} currentPlayerScore={playerScore} />
            {questionNumber == 4 && <MostSimilarToYou />}
        </QuestionScores>

    )
}

export default QuestionResults;