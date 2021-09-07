import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Deck } from '@whosaidtrue/app-interfaces';
import { api } from '../../api';

// local imports
import { RootState } from "../../app/store";

// TODO: clean up statuses that don't get used
type GameStatus = 'notInGame'
    | "gameCreateSuccess"
    | "gameCreateError"
    | "connecting"
    | "removed"
    | "lobby"
    | "playing"
    | "postGame"
    | "disconnected"
    | "gameCreateError"
    | "choosingName"

type JoinRequestStatus = 'idle' | 'accepted' | 'rejected' | 'awaitingResponse' | 'error'

export interface GameState {
    status: GameStatus;
    game_id: number;
    deck: Deck;
    targetName: string;
    targetId: number;
    isHost: boolean;
    currentHostName: string;
    players: string[];
    currentQuestionIndex: number;
    access_code: string;
    playerId: number;
    playerName: string;
    hasJoined: boolean;
    joinRequestStatus: JoinRequestStatus;
    joinRequestError: string;
}

export const initialState: GameState = {
    status: 'notInGame',
    game_id: 0,
    targetName: '',
    targetId: 0,
    deck: {
        id: 0,
        name: '',
        sort_order: 0,
        clean: false,
        age_rating: 0,
        status: 'active',
        description: '',
        movie_rating: 'G',
        sfw: true,
        thumbnail_url: '',
        purchase_price: ''
    },
    isHost: false,
    access_code: '',
    players: [],
    currentQuestionIndex: 0,
    currentHostName: '',
    playerName: '',
    hasJoined: false,
    joinRequestStatus: 'idle',
    joinRequestError: '',
    playerId: 0
}

export const sendEndGameSignal = createAsyncThunk(
    'game/sendEndGameSignal',
    async (_, thunkApi) => {
        // TODO: finish
        console.log('game over')
    }
)

export const sendRemovePlayerSignal = createAsyncThunk(
    'game/sendRemovePlayerSignal',
    async (playerId: number, thunkApi) => {
        // TODO: finish
        console.log('kick')
    }
)


export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        clearGame: () => {
            return initialState
        },
        setGameStatus: (state, action) => {
            state.status = action.payload;
        },
        setGameDeck: (state, action) => {
            state.deck = action.payload
        },
        setPlayerName: (state, action) => {
            state.playerName = action.payload;
        },

        initialRequest: (state, action) => {
            state.access_code = action.payload;
            state.status = 'choosingName';
        },
        setTarget: (state, action) => {
            state.targetName = action.payload.name;
            state.targetId = action.payload.id
        },
        clearTarget: (state) => {
            state.targetName = '';
            state.targetId = 0;
        },
        createGame: (state, action) => {
            state.access_code = action.payload.access_code
            state.game_id = action.payload.game_id
            state.isHost = true
            state.status = 'gameCreateSuccess'
        }
    },
})

export const {
    setPlayerName,
    initialRequest,
    setGameStatus,
    clearGame,
    setGameDeck,
    createGame,
    setTarget,
    clearTarget
} = gameSlice.actions;

// selectors
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectIsHost = (state: RootState) => state.game.isHost;
export const selectGameStatus = (state: RootState) => state.game.status;
export const selectAccessCode = (state: RootState) => state.game.access_code;
export const selectGameDeck = (state: RootState) => state.game.deck;
export const selectTargetName = (state: RootState) => state.game.targetName;
export const selectTargetId = (state: RootState) => state.game.targetId

export default gameSlice.reducer;
