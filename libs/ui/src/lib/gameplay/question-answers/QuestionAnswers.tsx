import tw from "tailwind-styled-components";
import GameContentCard from "../GameContentCard";
import GameCardFooter from "../GameCardFooter";
import Box from '../../containers/box/Box';
import PercentagePie from "./PercentagePie";

export interface QuestionAnswersProps {
    correctAnswer: number;
    questionText: string;
    followUp: string;
    groupTruePercent: number;
    globalTruePercent: number;
}

const Title = tw.h1`
text-center
text-xl
sm:text-3xl
font-bold
text-basic-black
`

const BodyText = tw.h3`
text-lg
sm:text-2xl
`
const QuestionResults: React.FC<QuestionAnswersProps> = ({
    questionText,
    followUp,
    children,
    correctAnswer,
    globalTruePercent,
    groupTruePercent,
}) => {
    return (
        <>
            <Title className="text-center">The Correct Answer is...</Title>

            {/* answer */}
            <GameContentCard>
                <Title>{correctAnswer} {`${correctAnswer}` === `${1}` ? 'player' : 'players'}</Title>
                <BodyText className="text-center">{questionText}</BodyText>
            </GameContentCard>

            {/* follow up */}
            <GameContentCard>
                <h3 className="text-center text-lg sm:text-xl font-black">Do tell...</h3>
                <BodyText className="whitespace-pre-wrap">{followUp}</BodyText>
            </GameContentCard>

            {/* pie charts */}
            <Box $horizontal boxstyle="purple-subtle" className="justify-center gap-4 sm:gap-8 p-3 md:p-6 filter drop-shadow-card-container">
                <PercentagePie isGroup={true} value={groupTruePercent} />
                <PercentagePie isGroup={false} value={globalTruePercent} />
            </Box>

            {children}
            <GameCardFooter >The host will advance the game to the Scoreboard</GameCardFooter>
        </>
    )
}

export default QuestionResults;