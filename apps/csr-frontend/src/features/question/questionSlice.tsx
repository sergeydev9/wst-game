import { createSlice, PayloadAction, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { CheckRatingResponse, payloads } from "@whosaidtrue/api-interfaces";
import { GameQuestionStatus, PlayerRef, ScoreboardEntry } from "@whosaidtrue/app-interfaces";
import { RootState } from "../../app/store";
import {
    selectPlayerId,
    selectPlayerName,
    selectGameStatus,
    selectTotalQuestions,
    clearGame,
    removePlayer,
    selectPlayerIds
} from "../game/gameSlice";

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
    scoreMap: {},
    scoreboard: [],
    haveNotAnswered: [],
    guessValue: 0
}


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
        setHaveNotAnswered: (state, action: PayloadAction<PlayerRef[]>) => {
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

        builder.addCase(clearGame, () => {
            return initialQuestionState;
        });

        builder.addCase(removePlayer, (state, action: PayloadAction<number>) => {
            state.haveNotAnswered = state.haveNotAnswered.filter(player => player.id !== action.payload);
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
    setHaveNotAnswered } = currentQuestionSlice.actions;

// selectors
export const selectTextForGuess = (state: RootState) => state.question.textForGuess;
export const selectSequenceIndex = (state: RootState) => state.question.sequenceIndex;
export const selectReaderId = (state: RootState) => state.question.readerId;
export const selectText = (state: RootState) => state.question.text;
export const selectHasAnswered = (state: RootState) => state.question.hasAnswered;
export const selectHasGuessed = (state: RootState) => state.question.hasGuessed;
export const selectRatingSubmitted = (state: RootState) => state.question.ratingSubmitted;
export const selectHaveNotAnswered = (state: RootState) => state.question.haveNotAnswered;
export const selectQuestionStatus = (state: RootState) => state.question.status;
export const selectGamequestionId = (state: RootState) => state.question.gameQuestionId;
export const selectGuessValue = (state: RootState) => state.question.guessValue;
export const selectPointsEarned = (state: RootState) => state.question.pointsEarned;
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

export const selectWinner = createSelector([selectScoreboard], (scores) => {
    const winners = scores.filter(score => score.rank === 1);

    let result = ""

    winners.forEach((winner, index) => {
        if (index > 0) {
            result += ` & ${winner.player_name}`
        } else {
            result += winner.player_name;
        }

    })

    return result;
});

export const selectIsReader = createSelector([selectPlayerId, selectReaderId], (playerId, readerId) => {
    return playerId === readerId;
})

export const selectPlayerPointsEarned = createSelector([selectPointsEarned, selectPlayerName], (pointsEarned, name) => {
    return Number(pointsEarned[name])
})

// array of ids for the players that haven't answered yet
export const selectNotAnsweredIds = createSelector(selectHaveNotAnswered, (players) => {
    return players.map(player => player.id);
})

// number of players that have submitted an answer and a guess, and are still connected to the game
// This is used in the waiting room to give the number at the bottom
export const selectNumHaveGuessed = createSelector([selectPlayerIds, selectNotAnsweredIds], (playerIds, notAnsweredIds) => {
    const filtered = playerIds.filter(player => !notAnsweredIds.includes(player));
    const result = filtered.length;
    return result > 0 ? result : 1; // If there is an error somewhere and the player's counts are incorrect, never show 0
});

// used to identify what screen the user should be on
export const currentScreen = createSelector(
    [
        selectQuestionStatus,
        selectHasAnswered,
        selectHasGuessed,
        selectGameStatus
    ], (status, hasAnswered, hasGuessed, gameStatus) => {

        // if in question (i.e. not results)
        if (status === 'question') {

            // if they haven't answered yet
            if (!hasAnswered) {
                return 'answerSubmit';
            }

            // if they have answered, but haven't guessed
            // show guess, else show waiting room
            return hasGuessed ? 'waitingRoom' : 'guess';
        } else if (status === 'answer' && gameStatus !== 'lobby') {
            return 'answerResults'
        }

        return gameStatus === 'lobby' ? 'lobby' : 'scoreResults'
    })

export const selectIsLastQuestion = createSelector([selectTotalQuestions, selectSequenceIndex], (total, current) => {
    return total === current
})

export default currentQuestionSlice.reducer;
