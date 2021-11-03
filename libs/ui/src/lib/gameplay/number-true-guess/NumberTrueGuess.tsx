import { useState } from 'react'
import Button from '../../button/Button';
import SliderInput from '../../inputs/slider/SliderInput';
import GameContentCard from '../GameContentCard';
import QuestionContent from '../QuestionContent';

export interface NumberTrueGuessProps {
    submitHandler: (value: number) => void;
    totalPlayers: number
    questionText: string;
}
const NumberTrueGuess: React.FC<NumberTrueGuessProps> = ({ submitHandler, questionText, totalPlayers }) => {

    const [value, setValue] = useState(0)
    const [isChanged, setIsChanged] = useState(false)

    // get current value from slider
    const valueHandler = (val: string) => {

        if (!isChanged) {
            setIsChanged(true)
        }
        setValue(parseInt(val))
    }

    return (
        <>
            <GameContentCard>
                <QuestionContent headline='How many players (including yourself) answered True to:' text={questionText} />
                <div className="px-4 md:px-14 w-full mb-8">
                    <SliderInput max={totalPlayers} changeHandler={valueHandler} />
                </div>
            </GameContentCard>
            <div className={`w-52 mx-auto ${!isChanged && 'opacity-40 pointer-events-none'}`}>
                <Button disabled={!isChanged} onClick={() => submitHandler(value)} type="button">Final Answer?!</Button>
            </div>

        </>
    )

}

export default NumberTrueGuess;