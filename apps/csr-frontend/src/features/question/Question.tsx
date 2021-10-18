import { TrueFalse, QuestionCard, NumberTrueGuess, WaitingRoom, QuestionAnswers } from "@whosaidtrue/ui";
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
    setGuessValue,
    selectGlobalTrue,
    selectGroupTrue,
    selectCorrectAnswer,
    selectFollowUp
} from '../question/questionSlice';
import { selectHasPassed, selectTotalQuestions, setHasPassed } from '../game/gameSlice';
import ReaderAnnouncement from "./ReaderAnnouncement";
import { selectHasRatedQuestion, showError, useSocket } from "..";
import { payloads, types } from "@whosaidtrue/api-interfaces";
import QuestionResults from './QuestionResults';
import { isLoggedIn } from "../auth/authSlice";
import RateQuestion from "./RateQuestion";

/**
 * This component controls what the user sees over the course
 * of a question. What component is rendered depends on whether
 * or not they have answered, and whether or not other players
 * have answered.
 */
const Question: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sendMessage } = useSocket();
    const loggedIn = useAppSelector(isLoggedIn);
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
    const globalTrue = useAppSelector(selectGlobalTrue);
    const groupTrue = useAppSelector(selectGroupTrue);
    const correctAnswer = useAppSelector(selectCorrectAnswer);
    const followUp = useAppSelector(selectFollowUp);
    const hasRated = useAppSelector(selectHasRatedQuestion);

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
            {isReader && screen === 'answerSubmit' && <ReaderAnnouncement />}
            <QuestionCard
                totalQuestions={totalQuestions}
                questionNumber={questionNumber}
                category="Entertainment">
                {screen === 'answerSubmit' && <TrueFalse submitHandler={answerHandler} text={text} isReader={isReader} hasPasses={!hasPassed} />}
                {screen === 'guess' && <NumberTrueGuess questionText={guessText} submitHandler={guessHandler} totalPlayers={totalPlayers} />}
                {screen === 'waitingRoom' && <WaitingRoom totalPlayers={totalPlayers} numberHaveGuessed={numHaveGuessed} guessValue={guessVal} questionText={guessText} />}
                {screen === 'answerResults' && (<QuestionAnswers
                    globalTruePercent={globalTrue}
                    groupTruePercent={groupTrue}
                    correctAnswer={correctAnswer}
                    questionText={guessText}
                    followUp={followUp}
                >
                    {loggedIn && !hasRated && <RateQuestion />}
                </QuestionAnswers>
                )}
                {screen === 'scoreResults' && <QuestionResults />}
            </QuestionCard>
        </>
    )
}

export default Question;