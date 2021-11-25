import { useState, useEffect } from 'react';
import tw from "tailwind-styled-components";
import GameContentCard from "../GameContentCard";
import GameCardFooter from "../GameCardFooter";
import Box from '../../containers/box/Box';
import PercentagePie from "./PercentagePie";

export interface QuestionAnswersProps {
    correctAnswer: number;
    questionText: string;
    showPercentage?: boolean;
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
    showPercentage
}) => {
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (!timer) {
            const time = setTimeout(() => setShowContent(true), 5000);
            setTimer(time);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
                setTimer(null);
            }
        }
    }, [timer]);

    return (
        <>
            <Title className="text-center">The Correct Answer is...</Title>

            {/* answer */}
            <GameContentCard>
                <Title>{correctAnswer} {`${correctAnswer}` === `${1}` ? 'player' : 'players'} {showPercentage && `(${Math.round(groupTruePercent)}%)`}</Title>
                <BodyText className="text-center">{questionText}</BodyText>
            </GameContentCard>
            {showContent && (
                <>
                    {/* follow up */}
                    <GameContentCard>
                        <h3 className="text-center text-lg sm:text-xl font-black">Do tell...</h3>
                        <BodyText className="whitespace-pre-wrap">{followUp}</BodyText>
                    </GameContentCard>

                    {/* pie charts */}
                    <Box boxstyle="purple-subtle" className="flex-col sm:flex-row justify-center gap-4 sm:gap-8 p-3 md:p-6 filter inset-8drop-shadow-card-container">
                        <PercentagePie isGroup={true} value={groupTruePercent} />
                        <PercentagePie isGroup={false} value={globalTruePercent} />
                    </Box>

                    {children}
                    <GameCardFooter >The host will advance the game to the Scoreboard</GameCardFooter>
                </>)}

        </>
    )
}

export default QuestionResults;