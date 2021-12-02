import tw from "tailwind-styled-components";
import GameCardFooter from "../GameCardFooter";
import PointsEarned from "../points-earned/PointsEarned";
import GuessAndValue from "../../guess-and-value/GuessAndValue";

const ScoreboardHeader = tw.h2`
    text-center
    font-bold
    text-basic-black
    text-2xl
`

export interface QuestionResultsProps {
    guess: string;
    correctAnswer: string;
    pointsEarned?: number;
    showPercent?: boolean;
    hasGuessed: boolean; // if user passed. If user passed, guess value will be 0, so another prop is needed
}
const QuestionResults: React.FC<QuestionResultsProps> = ({ guess, showPercent, correctAnswer, pointsEarned, children, hasGuessed }) => {

    return (
        <>
            {/* Guess and Value */}
            <GuessAndValue guess={guess} showPercent={showPercent} correctAnswer={correctAnswer} hasGuessed={hasGuessed} />

            {/* Points Earned */}
            {pointsEarned || pointsEarned === 0 ? <PointsEarned points={pointsEarned} /> : null}

            {/* Scoreboard */}
            <ScoreboardHeader>Scoreboard</ScoreboardHeader>
            {children}
            <GameCardFooter >The host will advance the game</GameCardFooter>
        </>
    )
}

export default QuestionResults;