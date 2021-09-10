import tw from "tailwind-styled-components";
import GameCardFooter from "../GameCardFooter";
import { LargeTitle } from "../../typography/Typography";


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

export interface QuestionResultsProps {
    guess: number;
    correctAnswer: number;
    pointsEarned: number;
}
const QuestionResults: React.FC<QuestionResultsProps> = ({ guess, correctAnswer, pointsEarned, children }) => {

    return (
        <>
            <div className={`
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
                `}>
                <div>
                    <SmallHeader>You Guessed</SmallHeader>
                    <MediumHeader>{guess} players</MediumHeader>
                </div>
                <div>
                    <SmallHeader>Correct Answer</SmallHeader>
                    <MediumHeader>{correctAnswer} players</MediumHeader>
                </div>
            </div>
            <LargeTitle className="text-green-base text-center mb-4">+{pointsEarned} pts</LargeTitle>
            <h2 className="text-center font-bold text-basic-black text-2xl">Scoreboard</h2>
            {children}
            <GameCardFooter >The host will advance the game</GameCardFooter>
        </>
    )
}

export default QuestionResults;