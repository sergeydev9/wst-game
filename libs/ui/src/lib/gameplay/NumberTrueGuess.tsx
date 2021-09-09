import SliderInput from '../slider-input/SliderInput';
import GameContentCard from './GameContentCard';
import QuestionContent from './QuestionContent';

export interface NumberTrueGuessProps {
    submitHandler: (value: number) => void;
    questionText: string;
}
const NumberTrueGuess: React.FC<NumberTrueGuessProps> = ({ submitHandler, questionText }) => {

    return (
        <GameContentCard>
            <QuestionContent headline='How many players (including yourself) answered True to:' text={questionText} />
        </GameContentCard>
    )

}

export default NumberTrueGuess;