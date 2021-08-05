import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DecksAttributes } from '@whosaidtrue/data';

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
    deck: DecksAttributes | Record<string, unknown>;
}

export const gameSlice = createSlice({
    name: "game",

})