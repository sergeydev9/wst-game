import { createSlice } from "@reduxjs/toolkit";
import { GameQuestionStatus, PlayerScore } from "@whosaidtrue/app-interfaces";
import { RootState } from "../../app/store";

export interface CurrentQuestionState {
    id: number;
    status: GameQuestionStatus;
    correctAnswer: number;
    sequenceIndex: number;
    hasAnswered: boolean;
    hasGuessed: boolean;
    readerId: number;
    readerName: string;
    followUp: string;
    primaryText: string;
    secondaryText: string;
    ratingSubmitted: boolean;
    answersPending: number;
    globalTrue: number;
    groupTrue: number;
    results: PlayerScore[];

}
export const initialState: CurrentQuestionState = {
    id: 0,
    status: "reading",
    sequenceIndex: 0,
    correctAnswer: 0,
    hasAnswered: false,
    hasGuessed: false,
    readerId: 0,
    readerName: '',
    followUp: '',
    primaryText: '',
    secondaryText: '',
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
        setCurrentQuestion: (state, action) => {
            const {
                id,
                sequenceIndex,
                followUp,
                primaryText,
                secondaryText,
                readerId,
                status,
                answersPending,
                readerName } = action.payload;

            state.id = id;
            state.sequenceIndex = sequenceIndex;
            state.followUp = followUp;
            state.primaryText = primaryText;
            state.secondaryText = secondaryText;
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
export const selectRatingSubmitted = (state: RootState) => state.question.ratingSubmitted;
export const selectResults = (state: RootState) => {
    const { results, globalTrue, groupTrue, correctAnswer } = state.question;
    return { results, globalTrue, groupTrue, correctAnswer }
}

export default currentQuestionSlice.reducer;