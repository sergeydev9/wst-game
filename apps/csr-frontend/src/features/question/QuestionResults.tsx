import { useEffect } from "react";
import { Scoreboard, QuestionScores } from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    selectCorrectAnswer,
    selectGuessValue,
    selectPlayerScore,
    selectScoreboard,
    selectSequenceIndex,
    selectPlayerPointsEarned,
    selectNumPlayers,
    selectGroupTrue,
    selectHasGuessed
} from "./questionSlice";
import { selectScoreTooltipDismissed, setShowScoreTooltip } from "../modal/modalSlice";
import MostSimilarToYou from "../fun-facts/MostSimilarToYou";
import { guessAsPercentage } from "../../util/functions";

const QuestionResults: React.FC = () => {
    const dispatch = useAppDispatch();
    const tooltipDismissed = useAppSelector(selectScoreTooltipDismissed);
    const playerScore = useAppSelector(selectPlayerScore);
    const groupTrue = useAppSelector(selectGroupTrue);
    const totalPlayers = useAppSelector(selectNumPlayers);
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
        <QuestionScores
            guess={totalPlayers > 10 ? guessAsPercentage(guess, totalPlayers) : `${guess}`}
            correctAnswer={totalPlayers > 10 ? `${Math.round(groupTrue)}%` : `${correctAnswer}`}
            showPercent={totalPlayers > 10}
            pointsEarned={points}
            hasGuessed={hasGuessed}>
            <Scoreboard scores={scoreboard} currentPlayerScore={playerScore} />
            {questionNumber == 4 && <MostSimilarToYou />}
        </QuestionScores>

    )
}

export default QuestionResults;