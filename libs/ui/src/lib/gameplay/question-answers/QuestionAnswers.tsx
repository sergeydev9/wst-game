import tw from "tailwind-styled-components";
import GameContentCard from "../GameContentCard";
import GameCardFooter from "../GameCardFooter";
import Box from '../../containers/box/Box';
import { UserRating } from "@whosaidtrue/app-interfaces";
import PercentagePie from "./PercentagePie";
import yawn from '../../assets/yawning-face.png';
import laugh from '../../assets/face-with-tears-of-joy.png';

export interface QuestionAnswersProps {
    correctAnswer: number;
    questionText: string;
    followUp: string;
    groupTruePercent: number;
    globalTruePercent: number;
    submitRatingHandler: (rating: UserRating) => void

}

const RatingButton = tw.div`
rounded-full
hover:bg-purple-50
active:bg-purple-100
bg-purple-card-bg
cursor-pointer
border
border-purple-subtle-stroke
shadow-rating-button
p-4
`

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
    correctAnswer,
    globalTruePercent,
    groupTruePercent,
    submitRatingHandler
}) => {

    return (
        <>
            <Title className="text-center">The Correct Answer is...</Title>

            {/* answer */}
            <GameContentCard>
                <Title>{correctAnswer} {correctAnswer === 1 ? 'player' : 'players'}</Title>
                <BodyText className="text-center">{questionText}</BodyText>
            </GameContentCard>

            {/* follow up */}
            <GameContentCard>
                <h3 className="text-center text-lg sm:text-xl font-black">Do tell...</h3>
                <BodyText>{followUp}</BodyText>
            </GameContentCard>

            {/* pie charts */}
            <Box $horizontal boxstyle="purple-subtle" className="justify-center gap-4 sm:gap-8 p-3 md:p-6 filter drop-shadow-card-container">
                <PercentagePie isGroup={true} value={groupTruePercent} />
                <PercentagePie isGroup={false} value={globalTruePercent} />
            </Box>

            {/* ratings */}
            <div className={`
            flex
            flex-col
            gap-5
            py-6
            mb-16
            sm:mb-10
            rounded-3xl
            items-center
            bg-purple-subtle-fill
            border-2
          border-purple-subtle-stroke
           w-4/5
           sm:w-3/5
           mx-auto
    `}>
                <h4 className="text-sm sm:text-md font-black text-center sm:w-3/5 mx-auto">Was it a fun question?</h4>
                <div className="flex flex-row gap-4 sm:gap-8 w-max">
                    <RatingButton><img src={yawn} alt='yawning emoji' width="40px" height="50px" onClick={() => submitRatingHandler('bad')} /></RatingButton>
                    <RatingButton><img src={laugh} alt='laugh emoji' width="40px" height="50px" onClick={() => submitRatingHandler('great')} /></RatingButton>

                </div>
            </div>
            <GameCardFooter >The host will advance the game to the Scoreboard</GameCardFooter>
        </>
    )
}

export default QuestionResults;