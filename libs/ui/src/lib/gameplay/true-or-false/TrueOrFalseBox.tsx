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
            <div className="mb-3 flex flex-row gap-2 w-full">
                <div className="w-full">
                    <Button type="button" buttonStyle="big-text" onClick={() => submitHandler('true')}>True</Button>
                </div>
                <div className="w-full">
                    <Button type="button" buttonStyle="big-text" onClick={() => submitHandler('false')}>False</Button>
                </div>
            </div>

            {hasPasses && (
                <div className="sm:px-2 xs:w-9/12 md:w-80 mx-auto">
                    <Button type="button" buttonStyle="big-text" onClick={() => submitHandler('pass')}>Pass (1 per game)</Button>
                </div>
            )}

        </GameContentCard>
    )

}

export default TrueOrFalseBox