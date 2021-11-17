import GameContentCard from '../GameContentCard';
import QuestionContent from '../QuestionContent';
import Button from '../../button/Button';

export interface TrueOrFalseBoxProps {
    isReader: boolean;
    submitHandler: (val: string) => void;
    hasPasses: boolean;
    text: string
}
const TrueOrFalseBox: React.FC<TrueOrFalseBoxProps> = ({ isReader, submitHandler, hasPasses, text }) => {
    return (
        <GameContentCard>
            {(isReader ? <QuestionContent text={text} headline='Read This Out Loud:' /> :
                <QuestionContent text='Another player will read this question to the whole group' headline="Listen up!" />)}
            <div className="flex flex-row justify-between gap-2 w-full">
                    <Button className="flex-1" type="button" onClick={() => submitHandler('true')}>True</Button>
                    <Button className="flex-1" type="button" onClick={() => submitHandler('false')}>False</Button>
            </div>

            {hasPasses && (
                <div className="flex max-w-full mt-3 mx-auto">
                    <Button type="button" onClick={() => submitHandler('pass')}>Pass (1 per game)</Button>
                </div>
            )}

        </GameContentCard>
    )

}

export default TrueOrFalseBox
