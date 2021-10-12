import { TrueFalse, QuestionCard, NumberTrueGuess } from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectIsReader, selectSequenceIndex, selectText, selectGamequestionId, currentScreen, selectTextForGuess, selectNumPlayers } from '../question/questionSlice';
import { selectHasPassed, selectTotalQuestions, setHasPassed } from '../game/gameSlice';
import ReaderAnnouncement from "./ReaderAnnouncement";
import { setHasAnswered, showError, useSocket } from "..";
import { payloads, types } from "@whosaidtrue/api-interfaces";

const Question: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sendMessage } = useSocket();
    const isReader = useAppSelector(selectIsReader);
    const text = useAppSelector(selectText);
    const hasPassed = useAppSelector(selectHasPassed);
    const gameQuestionId = useAppSelector(selectGamequestionId);
    const questionNumber = useAppSelector(selectSequenceIndex);
    const totalQuestions = useAppSelector(selectTotalQuestions);
    const guessText = useAppSelector(selectTextForGuess);
    const screen = useAppSelector(currentScreen);
    const numPlayers = useAppSelector(selectNumPlayers);


    const answerHandler = (value: string) => {
        sendMessage(types.ANSWER_PART_1, { gameQuestionId, answer: value } as payloads.AnswerPart1, ack => {
            if (ack === 'ok') {
                dispatch(setHasAnswered(true));

                if (value === 'pass') {
                    dispatch(setHasPassed(true))
                }
            } else {
                // if error while saving answer
                dispatch(showError('Could not submit answer'))
            }
        })
    }

    const guessHandler = (value: number) => {
        console.log(value)
    }

    return (
        <>
            {isReader && <ReaderAnnouncement />}
            <QuestionCard
                totalQuestions={totalQuestions}
                questionNumber={questionNumber}
                category="Entertainment">
                {screen === 'answer' && <TrueFalse submitHandler={answerHandler} text={text} isReader={isReader} hasPasses={!hasPassed} />}
                {screen === 'guess' && <NumberTrueGuess questionText={guessText} submitHandler={guessHandler} totalPlayers={numPlayers} />}

            </QuestionCard>
        </>
    )
}

export default Question;