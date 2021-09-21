import { createSlice } from "@reduxjs/toolkit";
import { PlayerScore } from "@whosaidtrue/app-interfaces";
import { RootState } from "../../app/store";

export interface CurrentQuestionState {
    sequenceIndex: number;
    readerId: number;
    followUp: string;
    text: string;
    ratingSubmitted: boolean;
    globalTrue: number;
    groupTrue: number;
    results: PlayerScore[];

}
export const initialState: CurrentQuestionState = {
    sequenceIndex: 0,
    readerId: 0,
    followUp: '',
    text: '',
    ratingSubmitted: false,
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
            const { sequenceIndex, readerId, followUp, text } = action.payload
            state.sequenceIndex = sequenceIndex;
            state.readerId = readerId;
            state.followUp = followUp;
            state.ratingSubmitted = false;
            state.text = text;
            state.globalTrue = 0;
            state.groupTrue = 0;
            state.results = []
        },

        setResults: (state, action) => {
            const { results, groupTrue, globalTrue } = action.payload;
            state.results = results;
            state.groupTrue = groupTrue;
            state.globalTrue = globalTrue;
        },

        setSequenceIndex: (state, action) => {
            state.sequenceIndex = action.payload;
        },

        setReaderId: (state, action) => {
            state.readerId = action.payload
        },

        setRatingSubmitted: (state, action) => {
            state.ratingSubmitted = action.payload
        }
    }
})

// actions
export const {
    clearCurrentQuestion,
    setCurrentQuestion,
    setResults,
    setSequenceIndex,
    setReaderId,
    setRatingSubmitted
} = currentQuestionSlice.actions;

// selectors
export const selectSequenceIndex = (state: RootState) => state.question.sequenceIndex;
export const selectReaderId = (state: RootState) => state.question.readerId;
export const selectRatingSubmitted = (state: RootState) => state.question.ratingSubmitted;
export const selectResults = (state: RootState) => {
    const { results, globalTrue, groupTrue } = state.question;
    return { results, globalTrue, groupTrue }
}

export default currentQuestionSlice.reducer;