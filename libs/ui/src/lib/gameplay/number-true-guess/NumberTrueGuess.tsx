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
            <div className={`w-52 mx-auto relative ${isDisabled && 'opacity-40 pointer-events-none'}`}>
                  <span className={`${pulsing && !isDisabled && 'bg-blue-base animate-ping-slow'} absolute w-full h-full inline-flex rounded-full opacity-75 pointer-events-none`}>
                  </span>
                  <Button
                      className="w-full"
                      disabled={isDisabled}
                      onClick={() => submitHandler(value)}
                      type="button">
                      Lock It In!
                  </Button>
            </div>
        </>
    )

}

export default NumberTrueGuess;
