import { useState, useEffect } from 'react'
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
    const [pulsing, setPulsing] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {

        return () => {
            if (timer) clearTimeout(timer);
        }
    }, [timer])


    // get current value from slider
    const valueHandler = (val: string) => {
        const time = setTimeout(() => setPulsing(true), 1500);

        setTimer(time);

        if (!isChanged) {
            setIsChanged(true)
        }
        setValue(parseInt(val))
    }

    return (
        <>
            <GameContentCard>
                <QuestionContent headline={<span>Now guess how many players (<span className="underline italic">including yourself</span>) answered TRUE to the question:</span>} text={questionText} />
                <div className="px-4 md:px-14 w-full mb-8">
                    <SliderInput max={totalPlayers} changeHandler={valueHandler} />
                </div>
            </GameContentCard>
            <div className={`w-52 mx-auto ${!isChanged && 'opacity-40 pointer-events-none'}`}>
                <Button disabled={!isChanged} className={pulsing ? "animate-pulse" : ""} onClick={() => submitHandler(value)} type="button">Final Answer ?!</Button>
            </div>

        </>
    )

}

export default NumberTrueGuess;
