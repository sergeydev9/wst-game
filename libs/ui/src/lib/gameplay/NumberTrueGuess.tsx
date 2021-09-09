import { useState } from 'react'
import SliderInput from '../slider-input/SliderInput';
import GameContentCard from './GameContentCard';
import QuestionContent from './QuestionContent';

export interface NumberTrueGuessProps {
    submitHandler: (value: number) => void;
    totalPlayers: number
    questionText: string;
}
const NumberTrueGuess: React.FC<NumberTrueGuessProps> = ({ submitHandler, questionText, totalPlayers }) => {

    const [value, setValue] = useState(0)

    // get current value from slider
    const valueHandler = (val: string) => {
        setValue(parseInt(val))
    }

    return (
        <GameContentCard>
            <QuestionContent headline='How many players (including yourself) answered True to:' text={questionText} />
            <div className="px-14 w-full">
                <SliderInput max={totalPlayers} changeHandler={valueHandler} />
            </div>
        </GameContentCard>
    )

}

export default NumberTrueGuess;