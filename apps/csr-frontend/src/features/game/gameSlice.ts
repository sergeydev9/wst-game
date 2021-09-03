import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateGameRequest } from "@whosaidtrue/api-interfaces";
import { Deck } from '@whosaidtrue/app-interfaces';
import { api } from '../../api';

// local imports
import { RootState } from "../../app/store";

type GameStatus = 'notInGame'
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

// TODO: change the error handling here
export const createGame = createAsyncThunk(
    'game/create',
    async (deckId: number, thunkApi) => {
        try {
            const response = await api.post('/games/create', { deckId } as CreateGameRequest)
            return response.data;
        } catch (e) {
            return thunkApi.rejectWithValue('error')
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
        setGameDeck: (state, action) => {
            state.deck = action.payload
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
    },
    extraReducers: (builder) => {
        // builder.addCase(createGame.fulfilled, (state, action) => {
        //     state.accessCode = action.payload.accessCode
        //     state.isHost = true
        //     state.deck = action.payload.deck
        //     state.status = 'choosingName'
        // })
    }
})

export const {
    setAccessCode,
    setPlayerName,
    initialRequest,
    setGameStatus,
    leaveGame,
    setGameDeck
} = gameSlice.actions;

// selectors
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectGameStatus = (state: RootState) => state.game.status;
export const selectAccessCode = (state: RootState) => state.game.accessCode;
export const selectGameDeck = (state: RootState) => state.game.deck;

export default gameSlice.reducer;
