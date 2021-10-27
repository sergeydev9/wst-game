import { createSlice, PayloadAction, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { CheckRatingResponse, payloads } from "@whosaidtrue/api-interfaces";
import { GameQuestionStatus, PlayerRef, ScoreboardEntry } from "@whosaidtrue/app-interfaces";
import { RootState } from "../../app/store";
import { selectPlayerId, selectPlayerName } from "../game/gameSlice";
import { api } from '../../api';

export interface CurrentQuestionState {
    questionId: number;
    gameQuestionId: number;
    hasRated: boolean;
    category: string;
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
    scores: string[];
    scoreMap: Record<string, ScoreboardEntry>; // index scores by player_name
    scoreboard: ScoreboardEntry[];
    haveNotAnswered: PlayerRef[];
    guessValue: number;
    pointsEarned: Record<string, string>;
}

export const initialQuestionState: CurrentQuestionState = {
    questionId: 0,
    gameQuestionId: 0,
    hasRated: false,
    category: '',
    status: '',
    pointsEarned: {},
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
    scores: [],
    scoreMap: {},
    scoreboard: [],
    haveNotAnswered: [],
    guessValue: 0
}


export const checkHasRatedQuestion = createAsyncThunk(
    'question/checkHasRated',
    async (questionId: number, { rejectWithValue }) => {
        return api.get<CheckRatingResponse>(`/ratings/question?id=${questionId}`).then(response => {
            return response.data;
        }).catch(err => {
            // log error, but don't need to notify user
            console.error(err)
            return rejectWithValue({ hasRated: false })
        })
    })

const currentQuestionSlice = createSlice({
    name: 'currentQuestion',
    initialState: initialQuestionState,
    reducers: {
        clearCurrentQuestion: () => {
            return initialQuestionState
        },
        setCurrentQuestion: (state, action: PayloadAction<payloads.SetQuestionState>) => {
            const {
                questionId,
                gameQuestionId,
                sequenceIndex,
                category,
                followUp,
                text,
                textForGuess,
                readerId,
                status,
                haveNotAnswered,
                numPlayers,
                globalTrue,
                readerName } = action.payload;

            state.questionId = questionId;
            state.gameQuestionId = gameQuestionId;
            state.sequenceIndex = sequenceIndex;
            state.followUp = followUp;
            state.text = text;
            state.textForGuess = textForGuess;
            state.readerId = readerId;
            state.status = status;
            state.globalTrue = globalTrue;
            state.haveNotAnswered = haveNotAnswered;
            state.numPlayers = numPlayers;
            state.readerName = readerName;
            state.hasAnswered = false;
            state.hasGuessed = false;
            state.correctAnswer = 0;
            state.guessValue = 0;
            state.category = category;
        },
        setReader: (state, action: PayloadAction<payloads.PlayerEvent>) => {
            const { id, player_name } = action.payload;
            state.readerId = id;
            state.readerName = player_name;
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
        setQuestionStatus: (state, action: PayloadAction<GameQuestionStatus>) => {
            state.status = action.payload;
        },
        setHasGuessed: (state, action) => {
            state.hasGuessed = action.payload
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        setHasRated: (state, action) => {
            state.hasRated = action.payload;
        },
        setHaveNotAnswered: (state, action) => {
            state.haveNotAnswered = action.payload
        },
        questionEnd: (state, action: PayloadAction<payloads.QuestionEnd>) => {
            const {
                groupTrue,
                pointsEarned,
                scores,
                correctAnswer
            } = action.payload;

            state.status = 'answer';
            state.groupTrue = groupTrue;
            state.pointsEarned = pointsEarned;
            state.correctAnswer = correctAnswer;
            state.scoreboard = scores;

            // index score by player_name
            state.scoreMap = scores.reduce((acc, curr) => {
                return { ...acc, [curr.player_name]: curr }
            }, {})
        }
    },
    extraReducers: (builder) => {
        builder.addCase(checkHasRatedQuestion.fulfilled, (state, action) => {
            state.hasRated = action.payload.hasRated;
        })
    }
})

// actions
export const {
    clearCurrentQuestion,
    setCurrentQuestion,
    setReader,
    setRatingSubmitted,
    setHasAnswered,
    setHasGuessed,
    setStatus,
    setGuessValue,
    questionEnd,
    setQuestionStatus,
    setHasRated,
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
export const selectPointsEarned = (state: RootState) => state.question.pointsEarned;
export const selectScores = (state: RootState) => state.question.scores;
export const selectCorrectAnswer = (state: RootState) => state.question.correctAnswer;
export const selectGroupTrue = (state: RootState) => state.question.groupTrue;
export const selectGlobalTrue = (state: RootState) => state.question.globalTrue;
export const selectNumPlayers = (state: RootState) => state.question.numPlayers;
export const selectScoreMap = (state: RootState) => state.question.scoreMap;
export const selectScoreboard = (state: RootState) => state.question.scoreboard;
export const selectFollowUp = (state: RootState) => state.question.followUp;
export const selectQuestionId = (state: RootState) => state.question.questionId;
export const selectHasRatedQuestion = (state: RootState) => state.question.hasRated;
export const selectCategory = (state: RootState) => state.question.category;

export const selectPlayerScore = createSelector([selectPlayerName, selectScoreMap], (name, scores,) => {
    return scores[name];
})

export const selectWinner = createSelector([selectScores], (scores) => scores[0]);

export const selectIsReader = createSelector([selectPlayerId, selectReaderId], (playerId, readerId) => {
    return playerId === readerId;
})

export const selectPlayerPointsEarned = createSelector([selectPointsEarned, selectPlayerName], (pointsEarned, name) => {
    return Number(pointsEarned[name])
})

// number of players that have submitted an answer and a guess
export const selectNumHaveGuessed = createSelector([selectNumPlayers, selectHaveNotAnswered], (numPlayers, notAnsweredList) => {
    return numPlayers - notAnsweredList.length;
});

// used to identify what screen the user should be on
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
                return 'answerSubmit';
            }

            // if they have answered, but haven't guessed
            // show guess, else show waiting room
            return hasGuessed ? 'waitingRoom' : 'guess';
        } else if (status === 'answer') {
            return 'answerResults'
        }

        return 'scoreResults'
    })

export default currentQuestionSlice.reducer;