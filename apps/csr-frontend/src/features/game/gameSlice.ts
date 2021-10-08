import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { JoinGameResponse } from '@whosaidtrue/api-interfaces';
import { Deck, UserGameStatus, PlayerRef, PlayerScore, GameStatus } from '@whosaidtrue/app-interfaces';
import omit from 'lodash.omit'

// local imports
import { RootState } from "../../app/store";

export interface GameState {
    gameStatus: GameStatus | '';
    playerStatus: UserGameStatus;
    hasPassed: boolean;
    gameToken: string,
    gameId: number;
    deck: Deck;
    totalQuestions: number;
    isHost: boolean;
    currentHostName: string;
    players: Record<number, PlayerRef>;
    inactivePlayers: PlayerRef[];
    disconnectedPlayers: PlayerRef[];
    access_code: string;
    playerId: number;
    playerName: string;
    results: PlayerScore[];
    winner: string;

}

export const initialState: GameState = {
    gameStatus: '',
    playerStatus: 'notInGame',
    gameToken: '',
    hasPassed: false,
    gameId: 0,
    deck: {
        id: 0,
        name: '',
        sort_order: 0,
        clean: false,
        age_rating: 0,
        status: 'active',
        description: '',
        movie_rating: 'PG',
        sfw: true,
        thumbnail_url: '',
        purchase_price: ''
    },
    totalQuestions: 0,
    isHost: false,
    access_code: '',
    players: {},
    inactivePlayers: [],
    disconnectedPlayers: [],
    currentHostName: '',
    playerName: '',
    playerId: 0,
    winner: '',
    results: [],

}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        clearGame: () => {
            return initialState
        },
        setGameStatus: (state, action) => {
            state.gameStatus = action.payload;
        },
        setGameDeck: (state, action) => {
            state.deck = action.payload
        },
        setPlayerName: (state, action) => {
            state.playerName = action.payload;
        },

        initialRequest: (state, action) => {
            state.access_code = action.payload;
            state.playerStatus = 'choosingName' as UserGameStatus;
        },
        addPlayer: (state, action) => {
            const { id } = action.payload
            state.players = { ...state.players, [id]: action.payload };
        },
        removePlayer: (state, action) => {
            state.players = omit(state.players, action.payload)
        },
        createGame: (state, action) => {
            state.access_code = action.payload.access_code
            state.gameId = action.payload.game_id
            state.isHost = true
            state.playerStatus = 'gameCreateSuccess';
        },
        setGameResults: (state, action) => {
            const { results, winner } = action.payload;
            state.results = results;
            state.winner = winner;
        },
        gameStateUpdate: (state, action) => {
            const {
                gameId,
                access_code,
                status,
                players,
                inactivePlayers,
                disconnectedPlayers,
                totalQuestions
            } = action.payload;
            state.gameId = gameId;
            state.access_code = access_code;
            state.gameStatus = status;
            state.disconnectedPlayers = disconnectedPlayers;
            state.players = players;
            state.inactivePlayers = inactivePlayers;
            state.totalQuestions = totalQuestions;
        },

        setInactive: (state, action) => {
            state.inactivePlayers = [...action.payload]
        },
        setPlayers: (state, action: PayloadAction<{ players: PlayerRef[] }>) => {
            const { players } = action.payload;
            state.players = players.reduce((acc: Record<number, PlayerRef>, player: PlayerRef) => {
                return { ...acc, [player.id]: player }
            }, {});
        },
        joinGame: (state, action: PayloadAction<JoinGameResponse>) => {
            const {
                status,
                gameId,
                deck,
                totalQuestions,
                currentHostName,
                access_code,
                playerId,
                playerName,
                gameToken
            } = action.payload;

            state.gameStatus = status;
            state.playerStatus = 'lobby';
            state.gameToken = gameToken;
            state.gameId = gameId;
            state.deck = deck;
            state.totalQuestions = totalQuestions;
            state.currentHostName = currentHostName;

            state.access_code = access_code;
            state.playerId = playerId;
            state.playerName = playerName
        }
    }
})

// actions
export const {
    setPlayerName,
    initialRequest,
    setGameStatus,
    clearGame,
    setGameDeck,
    createGame,
    addPlayer,
    removePlayer,
    joinGame,
    setInactive,
    gameStateUpdate,
    setGameResults,
    setPlayers
} = gameSlice.actions;

// selectors
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectIsHost = (state: RootState) => state.game.isHost;
export const selectGameId = (state: RootState) => state.game.gameId;
export const selectGameToken = (state: RootState) => state.game.gameToken;
export const selectGameStatus = (state: RootState) => state.game.gameStatus;
export const selectAccessCode = (state: RootState) => state.game.access_code;
export const selectGameDeck = (state: RootState) => state.game.deck;
export const selectPlayerId = (state: RootState) => state.game.playerId;
export const selectInactive = (state: RootState) => state.game.inactivePlayers;
export const selectDisconnected = (state: RootState) => state.game.disconnectedPlayers;
export const selectPlayerStatus = (state: RootState) => state.game.playerStatus;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectPlayerList = createSelector(selectPlayers, (players) => {
    return Object.values(players);
})

export default gameSlice.reducer;
