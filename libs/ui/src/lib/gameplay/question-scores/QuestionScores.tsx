import tw from "tailwind-styled-components";
import GameCardFooter from "../GameCardFooter";
import { LargeTitle } from "../../typography/Typography";
import PointsEarned from "../points-earned/PointsEarned";

const SmallHeader = tw.h3`
    text-lg
    font-bold
    text-center
`

const MediumHeader = tw.h2`
    text-xl
    font-bold
    text-center
`
const Container = tw.div`
    bg-green-subtle-fill
    border
    rounded-3xl
    mx-auto
    p-4
    border-green-subtle-stroke
    flex
    flex-row
    gap-4
    text-green-base
    justify-around
    w-full
    sm:w-max
`

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
            <Container>
                {hasGuessed && <div>
                    <SmallHeader>You Guessed</SmallHeader>
                    <MediumHeader>{guess} {guess === '1' ? 'player' : showPercent ? 'of players' : 'players'}</MediumHeader>
                </div>}
                <div>
                    <SmallHeader>Correct Answer</SmallHeader>
                    <MediumHeader>{correctAnswer === '1' ? `${correctAnswer} player` : `${correctAnswer} ${showPercent ? 'of players' : 'players'}`}</MediumHeader>
                </div>
            </Container>

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