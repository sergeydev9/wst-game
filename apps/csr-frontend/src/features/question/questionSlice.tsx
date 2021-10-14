import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { payloads } from "@whosaidtrue/api-interfaces";
import { GameQuestionStatus, PlayerRef, PlayerScore } from "@whosaidtrue/app-interfaces";
import { RootState } from "../../app/store";
import { buildScoreboardAndMap } from "../../util/functions";
import { selectPlayerId, selectPlayerName } from "../game/gameSlice";

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
    rankDifferences: Record<string, string>;
    scores: string[];
    scoreMap: Record<string, PlayerScore>; // index scores by player_name
    scoreboard: PlayerScore[];
    haveNotAnswered: PlayerRef[];
    guessValue: number;
    pointsEarned: Record<string, string>;
}

export const initialQuestionState: CurrentQuestionState = {
    questionId: 0,
    gameQuestionId: 0,
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
    rankDifferences: {},
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
        setHaveNotAnswered: (state, action) => {
            state.haveNotAnswered = action.payload
        },
        questionEnd: (state, action: PayloadAction<payloads.QuestionEnd>) => {
            const {
                groupTrue,
                pointsEarned,
                scores,
                rankDifferences,
                correctAnswer
            } = action.payload;

            state.status = 'answer';
            state.groupTrue = groupTrue;
            state.pointsEarned = pointsEarned;
            state.correctAnswer = correctAnswer;
            state.scores = scores;
            state.rankDifferences = rankDifferences;

            const [scoreMap, scoreboard] = buildScoreboardAndMap(scores, rankDifferences);
            state.scoreMap = scoreMap;
            state.scoreboard = scoreboard;
        }
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
export const selectRankDifferences = (state: RootState) => state.question.rankDifferences;
export const selectScoreMap = (state: RootState) => state.question.scoreMap;
export const selectScoreboard = (state: RootState) => state.question.scoreboard;
export const selectFollowUp = (state: RootState) => state.question.followUp;
export const selectQuestionId = (state: RootState) => state.question.questionId

export const selectPlayerScore = createSelector([selectPlayerName, selectScoreMap], (name, scores,) => {
    return scores[name];
})

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