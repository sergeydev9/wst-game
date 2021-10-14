import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { JoinGameResponse } from '@whosaidtrue/api-interfaces';
import { Deck, UserGameStatus, PlayerRef, PlayerScore, GameStatus } from '@whosaidtrue/app-interfaces';
import omit from 'lodash.omit'

// local imports
import { RootState } from "../../app/store";

export interface GameState {
    gameStatus: GameStatus | '';
    playerStatus: UserGameStatus;
    announceWinner: boolean;
    hasPassed: boolean;
    gameToken: string,
    gameId: number;
    deck: Deck;
    totalQuestions: number;
    isHost: boolean;
    hostName: string;
    players: Record<number, PlayerRef>;
    inactivePlayers: PlayerRef[];
    disconnectedPlayers: PlayerRef[];
    access_code: string;
    playerId: number;
    playerName: string;
    winner: string;

}

export const initialGameState: GameState = {
    gameStatus: '',
    playerStatus: 'notInGame',
    announceWinner: false, // should there be a winner announcement when user gets to results
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
    hostName: '',
    playerName: '',
    playerId: 0,
    winner: '',
}

export const gameSlice = createSlice({
    name: "game",
    initialState: initialGameState,
    reducers: {
        clearGame: () => {
            return initialGameState
        },
        setGameStatus: (state, action) => {
            state.gameStatus = action.payload;
        },
        setPlayerStatus: (state, action: PayloadAction<UserGameStatus>) => {
            state.playerStatus = action.payload
        },
        setGameDeck: (state, action) => {
            state.deck = action.payload
        },
        setPlayerName: (state, action) => {
            state.playerName = action.payload;
        },
        setHasPassed: (state, action) => {
            state.hasPassed = action.payload
        },
        initialRequest: (state, action) => {
            state.access_code = action.payload;
            state.playerStatus = 'choosingName';
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
                hostName,
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
            state.hostName = hostName;
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
    setPlayers,
    setPlayerStatus,
    setHasPassed
} = gameSlice.actions;

// selectors
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectIsHost = (state: RootState) => state.game.isHost;
export const selectHasPassed = (state: RootState) => state.game.hasPassed;
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
export const selectTotalQuestions = (state: RootState) => state.game.totalQuestions;
export const selectPlayerList = createSelector(selectPlayers, (players) => {
    return Object.values(players);
})

export default gameSlice.reducer;
