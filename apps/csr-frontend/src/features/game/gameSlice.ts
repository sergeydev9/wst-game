import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Deck } from '@whosaidtrue/app-interfaces';

// local imports
import { history } from "../../app/hooks";
import { ROUTES } from "../../util/constants";
import { RootState } from "../../app/store";

type GameStatus = "creating"
    | "connecting"
    | "removed"
    | "lobby"
    | "playing"
    | "post-game"
    | "disconnected"
    | "error"

export interface GameState {
    status: GameStatus;
    gameId: string;
    host: boolean;
    deck: Omit<Deck, 'created_at' | 'updated_at'>;
}

// export const gameSlice = createSlice({


// })