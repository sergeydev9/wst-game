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
        setValue(parseFloat(val))
    }

    const isDisabled = !isChanged || Number(value) < 0;

    return (
        <>
            <GameContentCard>
                <QuestionContent
                    headline={<span>Now guess how many players (<span className="underline italic">including yourself</span>) answered TRUE to the question:</span>}
                    text={questionText} />
                <SliderInput max={totalPlayers} changeHandler={valueHandler} />
            </GameContentCard>
            <div className={`w-52 mx-auto ${isDisabled && 'opacity-40 pointer-events-none'}`}>
                <div className="flex w-max h-max relative">
                    <span className={`${pulsing && !isDisabled && "animate-ping-slow"} bg-blue-base w-full h-full inline-flex rounded-3xl absolute opacity-75`}>
                    </span>
                    <Button
                        className="inline-flex relative"
                        disabled={isDisabled}
                        onClick={() => submitHandler(value)}
                        type="button">
                        Final Answer ?!
                    </Button>

                </div>

            </div>

        </>
    )

}

export default NumberTrueGuess;
