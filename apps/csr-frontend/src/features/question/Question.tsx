import { TrueFalse, QuestionCard, NumberTrueGuess, WaitingRoom } from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    selectIsReader,
    selectSequenceIndex,
    selectText,
    selectGamequestionId,
    currentScreen,
    selectTextForGuess,
    selectNumPlayers,
    setHasAnswered,
    setHasGuessed,
    selectNumHaveGuessed,
    selectGuessValue,
    setGuessValue
} from '../question/questionSlice';
import { selectHasPassed, selectTotalQuestions, setHasPassed } from '../game/gameSlice';
import ReaderAnnouncement from "./ReaderAnnouncement";
import { showError, useSocket } from "..";
import { payloads, types } from "@whosaidtrue/api-interfaces";

/**
 * This component controls what the user sees over the course
 * of a question. What component is rendered depends on whether
 * or not they have answered, and whether or not other players
 * have answered.
 */
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
    const totalPlayers = useAppSelector(selectNumPlayers);
    const numHaveGuessed = useAppSelector(selectNumHaveGuessed);
    const guessVal = useAppSelector(selectGuessValue);


    // submit true/false answer
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

    // submit number true guess
    const guessHandler = (value: number) => {
        sendMessage(types.ANSWER_PART_2, { gameQuestionId, guess: value } as payloads.AnswerPart2, ack => {
            if (ack === 'ok') {
                dispatch(setHasGuessed(true));
                dispatch(setGuessValue(value));
            } else {
                // if error while saving answer
                dispatch(showError('Could not submit guess'))
            }
        })
    }

    return (
        <>
            {isReader && screen === 'answer' && <ReaderAnnouncement />}
            <QuestionCard
                totalQuestions={totalQuestions}
                questionNumber={questionNumber}
                category="Entertainment">
                {screen === 'answer' && <TrueFalse submitHandler={answerHandler} text={text} isReader={isReader} hasPasses={!hasPassed} />}
                {screen === 'guess' && <NumberTrueGuess questionText={guessText} submitHandler={guessHandler} totalPlayers={totalPlayers} />}
                {screen === 'waitingRoom' && <WaitingRoom totalPlayers={totalPlayers} numberHaveGuessed={numHaveGuessed} guessValue={guessVal} questionText={guessText} />}

            </QuestionCard>
        </>
    )
}

export default Question;