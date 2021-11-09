import { useState } from 'react';
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
    selectFollowUp,
    selectCategory
} from '../question/questionSlice';
import { ImSpinner6 } from '@react-icons/all-files/im/ImSpinner6';
import { selectHasPassed, selectTotalQuestions, setHasPassed } from '../game/gameSlice';
import ReaderAnnouncement from "./ReaderAnnouncement";
import { selectHasRatedQuestion, showError, useSocket } from "..";
import { payloads, types } from "@whosaidtrue/api-interfaces";
import QuestionResults from './QuestionResults';
import { isLoggedIn } from "../auth/authSlice";
import RateQuestion from "../ratings/RateQuestion";

/**
 * This component controls what the user sees over the course
 * of a question. What component is rendered depends on whether
 * or not they have answered, and whether or not other players
 * have answered.
 */
const Question: React.FC = () => {
    const dispatch = useAppDispatch();
    const [submittingGuess, setSubmittingGuess] = useState(false);
    const [submittingAnswer, setSubmittingAnswer] = useState(false);
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
    const category = useAppSelector(selectCategory);

    // submit true/false answer
    const answerHandler = (value: string) => {

        // if button disabled, do nothing
        if (submittingAnswer) return;

        setSubmittingAnswer(true);

        // submit
        sendMessage(types.ANSWER_PART_1, { gameQuestionId, answer: value } as payloads.AnswerPart1, ack => {
            setSubmittingAnswer(false);

            if (ack === 'ok') {
                dispatch(setHasAnswered(true));

                if (value === 'pass') {
                    dispatch(setHasPassed(true));

                }
            } else {
                // if error while saving answer
                dispatch(showError('Could not submit answer'));

            }
        })
    }

    // submit number true guess
    const guessHandler = (value: number) => {
        if (submittingGuess) return;

        setSubmittingGuess(true)

        sendMessage(types.ANSWER_PART_2, { gameQuestionId, guess: value } as payloads.AnswerPart2, ack => {
            setSubmittingGuess(false);

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
                category={category}>

                {screen === 'answerSubmit' && <TrueFalse submitHandler={answerHandler} text={text} isReader={isReader && !submittingAnswer} hasPasses={!hasPassed} />}
                {screen === 'guess' && <NumberTrueGuess questionText={guessText} submitHandler={guessHandler} totalPlayers={totalPlayers} />}
                {screen === 'waitingRoom' && <WaitingRoom totalPlayers={totalPlayers} numberHaveGuessed={numHaveGuessed} guessValue={guessVal} questionText={guessText} />}
                {screen === 'answerResults' && (<QuestionAnswers
                    globalTruePercent={globalTrue}
                    groupTruePercent={Math.floor(groupTrue)}
                    correctAnswer={correctAnswer}
                    questionText={guessText}
                    followUp={followUp}
                >
                    {loggedIn && !hasRated && <RateQuestion />}
                </QuestionAnswers>
                )}
                {screen === 'scoreResults' && <QuestionResults />}
                {(submittingGuess || submittingAnswer) && <ImSpinner6 className="text-yellow-gradient-to animate-spin left-1/2 top-p85 absolute -transform-x-full w-6 h-6" />}
            </QuestionCard>
        </>
    )
}

export default Question;