import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Deck } from '@whosaidtrue/app-interfaces';

// local imports
import { history } from "../../app/hooks";
import { ROUTES } from "../../util/constants";
import { RootState } from "../../app/store";

type GameStatus = ''
    | "creating"
    | "connecting"
    | "removed"
    | "waitingToStart"
    | "waitingToJoin"
    | "playing"
    | "postGame"
    | "disconnected"
    | "error"
    | "choosingName"

export interface GameState {
    status: GameStatus;
    gameId: string;
    isHost: boolean;
    deckName: string;
    gameCode: string;
    playerName: string;
    deckThumbnailUrl: string; // TODO: make sure there are thumbnails
}

export const initialState: GameState = {
    status: '',
    gameId: '',
    isHost: false,
    deckName: '',
    gameCode: '',
    playerName: '',
    deckThumbnailUrl: ''
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        leaveGame: () => {
            return initialState
        },
        setPlayerName: (state, action) => {
            state.playerName = action.payload
        }
    }
})

// selectors
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectGameStatus = (state: RootState) => state.game.status;

export default gameSlice.reducer;
