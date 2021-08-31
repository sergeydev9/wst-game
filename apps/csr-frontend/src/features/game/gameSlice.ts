import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateGameRequest } from "@whosaidtrue/api-interfaces";
import { Deck } from '@whosaidtrue/app-interfaces';
import { number } from "yargs";
import { api } from '../../api';

// local imports
import { RootState } from "../../app/store";

type GameStatus = 'notInGame'
    | "creating"
    | "connecting"
    | "removed"
    | "lobby"
    | "playing"
    | "postGame"
    | "disconnected"
    | "error"
    | "choosingName"

type JoinRequestStatus = 'idle' | 'accepted' | 'rejected' | 'awaitingResponse' | 'error'

export interface GameState {
    status: GameStatus;
    gameId: string;
    deck: Deck;
    isHost: boolean;
    currentHostName: string;
    players: string[];
    currentQuestionIndex: number;
    accessCode: string;
    playerId: number;
    playerName: string;
    hasJoined: boolean;
    joinRequestStatus: JoinRequestStatus;
    joinRequestError: string;
}

export const initialState: GameState = {
    status: 'notInGame',
    gameId: '',
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
    accessCode: '',
    players: [],
    currentQuestionIndex: 0,
    currentHostName: '',
    playerName: '',
    hasJoined: false,
    joinRequestStatus: 'idle',
    joinRequestError: '',
    playerId: 0
}

export const createGame = createAsyncThunk(
    'game/create',
    async (createGameReq: CreateGameRequest, thunkApi) => {
        try {
            const response = await api.post('/games/create', createGameReq)
            return response.data;
        } catch (e) {
            thunkApi.rejectWithValue(e.response.data)
        }

    }
)

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        leaveGame: () => {
            return initialState
        },
        setGameStatus: (state, action) => {
            state.status = action.payload;
        },
        setPlayerName: (state, action) => {
            state.playerName = action.payload;
        },
        setAccessCode: (state, action) => {
            state.accessCode = action.payload;
        },
        initialRequest: (state, action) => {
            state.accessCode = action.payload;
            state.status = 'choosingName';
        }
    }
})

export const {
    setAccessCode,
    setPlayerName,
    initialRequest,
    setGameStatus,
    leaveGame
} = gameSlice.actions;

// selectors
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectGameStatus = (state: RootState) => state.game.status;
export const selectAccessCode = (state: RootState) => state.game.accessCode

export default gameSlice.reducer;
