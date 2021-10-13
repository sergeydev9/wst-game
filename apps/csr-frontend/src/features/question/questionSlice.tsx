import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { payloads } from "@whosaidtrue/api-interfaces";
import { GameQuestionStatus, PlayerRef, PlayerScore } from "@whosaidtrue/app-interfaces";
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
    numPlayers: number;
    readerId: number;
    readerName: string;
    followUp: string;
    text: string;
    textForGuess: string;
    ratingSubmitted: boolean;
    globalTrue: number;
    groupTrue: number;
    results: PlayerScore[];
    haveNotAnswered: PlayerRef[];
    guessValue: number;
}

export const initialState: CurrentQuestionState = {
    questionId: 0,
    gameQuestionId: 0,
    status: '',
    numPlayers: 0,
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
    globalTrue: 0,
    groupTrue: 0,
    results: [],
    haveNotAnswered: [],
    guessValue: 0
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
                haveNotAnswered,
                numPlayers,
                readerName } = action.payload;

            state.questionId = questionId;
            state.gameQuestionId = gameQuestionId;
            state.sequenceIndex = sequenceIndex;
            state.followUp = followUp;
            state.text = text;
            state.textForGuess = textForGuess;
            state.readerId = readerId;
            state.status = status;
            state.haveNotAnswered = haveNotAnswered;
            state.numPlayers = numPlayers;
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
        setGuessValue: (state, action) => {
            state.guessValue = action.payload
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
        setHaveNotAnswered: (state, action) => {
            state.haveNotAnswered = action.payload
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
    setGuessValue,
    setHaveNotAnswered } = currentQuestionSlice.actions;

// selectors
export const selectTextForGuess = (state: RootState) => state.question.textForGuess;
export const selectSequenceIndex = (state: RootState) => state.question.sequenceIndex;
export const selectReaderId = (state: RootState) => state.question.readerId;
export const selectText = (state: RootState) => state.question.text;
export const selectHasAnswered = (state: RootState) => state.question.hasAnswered;
export const selectHasGuessed = (state: RootState) => state.question.hasGuessed;
export const selectRatingSubmitted = (state: RootState) => state.question.ratingSubmitted;
export const selectHaveNotAnswered = (state: RootState) => state.question.haveNotAnswered
export const selectQuestionStatus = (state: RootState) => state.question.status;
export const selectGamequestionId = (state: RootState) => state.question.gameQuestionId;
export const selectGuessValue = (state: RootState) => state.question.guessValue;
export const selectIsReader = createSelector([selectPlayerId, selectReaderId], (playerId, readerId) => {
    return playerId === readerId;
})
export const selectNumPlayers = (state: RootState) => state.question.numPlayers;

// number of players that have submitted an answer and a guess
export const selectNumHaveGuessed = createSelector([selectNumPlayers, selectHaveNotAnswered], (numPlayers, notAnsweredList) => {
    return numPlayers - notAnsweredList.length;
})

export const selectResults = (state: RootState) => {
    const { results, globalTrue, groupTrue, correctAnswer } = state.question;
    return { results, globalTrue, groupTrue, correctAnswer }
}

export const currentScreen = createSelector(
    [
        selectQuestionStatus,
        selectHasAnswered,
        selectHasGuessed
    ], (status, hasAnswered, hasGuessed) => {

        // if in question (i.e. not results)
        if (status === 'question') {

            // if they haven't answered yet
            if (!hasAnswered) {
                return 'answer';
            }

            // if they have answered, but haven't guessed
            // show guess, else show waiting room
            return hasGuessed ? 'waitingRoom' : 'guess';
        }

        return 'results'
    })

export default currentQuestionSlice.reducer;