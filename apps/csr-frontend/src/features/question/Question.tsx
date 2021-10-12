import { TrueFalse, QuestionCard } from "@whosaidtrue/ui";
import { useAppSelector } from "../../app/hooks";
import { selectIsReader, selectSequenceIndex, selectText } from '../question/questionSlice';
import { selectHasPassed, selectTotalQuestions } from '../game/gameSlice';
import ReaderAnnouncement from "./ReaderAnnouncement";

const Question: React.FC = () => {
    const isReader = useAppSelector(selectIsReader)
    const text = useAppSelector(selectText);
    const hasPassed = useAppSelector(selectHasPassed);
    const questionNumber = useAppSelector(selectSequenceIndex);
    const totalQuestions = useAppSelector(selectTotalQuestions)

    const submitHandler = (value: string) => {
        console.log(value);
    }
    return (
        <>
            {isReader && <ReaderAnnouncement />}
            <QuestionCard totalQuestions={totalQuestions} questionNumber={questionNumber} category="Entertainment">
                <TrueFalse submitHandler={submitHandler} text={text} isReader={isReader} hasPasses={!hasPassed} />

            </QuestionCard>
        </>
    )
}

export default Question;