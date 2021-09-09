import Box from '../box/Box';
import QuestionContent from './QuestionContent';
import Button from '../button/Button';

export interface TrueOrFalseBoxProps {
    isReader: boolean;
    submitHandler: (val: string) => void;
    hasPasses: boolean;
    text: string
}
const TrueOrFalseBox: React.FC<TrueOrFalseBoxProps> = ({ isReader, submitHandler, hasPasses, text }) => {
    return (
        <Box boxstyle="purple-subtle" className="p-3 md:p-6">
            {(isReader ? <QuestionContent text={text} headline='Read This Out Loud:' /> :
                <QuestionContent text='Another player will read this question to the whole group' headline="Listen up!" />)}
            <div className="mb-3 flex flex-row gap-2 w-full">
                <div className="w-full">
                    <Button type="button" onClick={() => submitHandler('true')}>True</Button>
                </div>
                <div className="w-full">
                    <Button type="button" onClick={() => submitHandler('false')}>False</Button>
                </div>
            </div>

            {hasPasses && <div className="w-full sm:px-4 md:w-96"><Button type="button" onClick={() => submitHandler('pass')}>Pass (1 per game)</Button></div>}

        </Box>
    )

}

export default TrueOrFalseBox