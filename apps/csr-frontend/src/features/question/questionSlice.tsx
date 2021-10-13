import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { payloads } from "@whosaidtrue/api-interfaces";
import { GameQuestionStatus, PlayerScore } from "@whosaidtrue/app-interfaces";
import { RootState } from "../../app/store";
import { selectPlayerId } from "../game/gameSlice";

export interface CurrentQuestionState {
    questionId: number;
    gameQuestionId: number;
    status: GameQuestionStatus;
    correctAnswer: number;
    sequenceIndex: number;
    hasAnswered: boolean;
    hasGuessed: boolean;
    readerId: number;
    readerName: string;
    followUp: string;
    text: string;
    textForGuess: string;
    ratingSubmitted: boolean;
    answersPending: number;
    globalTrue: number;
    groupTrue: number;
    results: PlayerScore[];

}
export const initialState: CurrentQuestionState = {
    questionId: 0,
    gameQuestionId: 0,
    status: '',
    sequenceIndex: 0,
    correctAnswer: 0,
    hasAnswered: false,
    hasGuessed: false,
    readerId: 0,
    readerName: '',
    followUp: '',
    text: '',
    textForGuess: '',
    ratingSubmitted: false,
    answersPending: 0,
    globalTrue: 0,
    groupTrue: 0,
    results: []
}

const currentQuestionSlice = createSlice({
    name: 'currentQuestion',
    initialState,
    reducers: {
        clearCurrentQuestion: () => {
            return initialState
        },
        setCurrentQuestion: (state, action: PayloadAction<payloads.SetQuestionState>) => {
            const {
                questionId,
                gameQuestionId,
                sequenceIndex,
                followUp,
                text,
                textForGuess,
                readerId,
                status,
                answersPending,
                readerName } = action.payload;

            state.questionId = questionId;
            state.gameQuestionId = gameQuestionId;
            state.sequenceIndex = sequenceIndex;
            state.followUp = followUp;
            state.text = text;
            state.textForGuess = textForGuess;
            state.readerId = readerId;
            state.status = status;
            state.answersPending = answersPending;
            state.readerName = readerName;
        },

        setResults: (state, action) => {
            const {
                results,
                groupTrue,
                globalTrue,
                correctAnswer } = action.payload;
            state.results = results;
            state.groupTrue = groupTrue;
            state.globalTrue = globalTrue;
            state.correctAnswer = correctAnswer
        },
        setReader: (state, action) => {
            const { readerId, readerName } = action.payload;
            state.readerId = readerId;
            state.readerName = readerName;
        },

        setRatingSubmitted: (state, action) => {
            state.ratingSubmitted = action.payload
        },

        setHasAnswered: (state, action) => {
            state.hasAnswered = action.payload
        },

        setHasGuessed: (state, action) => {
            state.hasGuessed = action.payload
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        setAnswersPending: (state, action) => {
            state.answersPending = action.payload;
        }

    }
})

// actions
export const {
    clearCurrentQuestion,
    setCurrentQuestion,
    setResults,
    setReader,
    setRatingSubmitted,
    setHasAnswered,
    setHasGuessed,
    setStatus,
    setAnswersPending } = currentQuestionSlice.actions;

// selectors
export const selectSequenceIndex = (state: RootState) => state.question.sequenceIndex;
export const selectReaderId = (state: RootState) => state.question.readerId;
export const selectText = (state: RootState) => state.question.text;
export const selectRatingSubmitted = (state: RootState) => state.question.ratingSubmitted;
export const selectResults = (state: RootState) => {
    const { results, globalTrue, groupTrue, correctAnswer } = state.question;
    return { results, globalTrue, groupTrue, correctAnswer }
}
export const selectQuestionStatus = (state: RootState) => state.question.status;

export const selectIsReader = createSelector([selectPlayerId, selectReaderId], (playerId, readerId) => {
    return playerId === readerId;
})

export default currentQuestionSlice.reducer;