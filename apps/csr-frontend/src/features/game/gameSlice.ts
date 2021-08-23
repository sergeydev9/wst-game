import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Deck } from '@whosaidtrue/app-interfaces';

// local imports
import { history } from "../../app/hooks";
import { ROUTES } from "../../util/constants";
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

type JoinRequestStatus = 'idle' | 'accepted' | 'rejected' | 'awaitingResponse' | 'error' | 'notSent'

export interface GameState {
    status: GameStatus;
    gameId: string;
    isHost: boolean;
    currentHostName: string;
    otherPlayers: string[];
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
    isHost: false,
    accessCode: '',
    otherPlayers: [],
    currentQuestionIndex: 0,
    currentHostName: '',
    playerName: '',
    hasJoined: false,
    joinRequestStatus: 'idle',
    joinRequestError: '',
    playerId: 0
}

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
            state.joinRequestStatus = 'notSent';
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
