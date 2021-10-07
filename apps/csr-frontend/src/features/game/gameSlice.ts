import { createSlice, createSelector } from "@reduxjs/toolkit";
import { Deck, UserGameStatus, PlayerRef, PlayerScore } from '@whosaidtrue/app-interfaces';
import omit from 'lodash.omit'

// local imports
import { RootState } from "../../app/store";

export interface GameState {
    status: UserGameStatus;
    hasPassed: boolean;
    gameToken: string,
    game_id: number;
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
    status: 'notInGame',
    gameToken: '',
    hasPassed: false,
    game_id: 0,
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
            state.status = 'choosingName' as UserGameStatus;
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
            state.game_id = action.payload.game_id
            state.isHost = true
            state.status = 'gameCreateSuccess';
        },
        setGameResults: (state, action) => {
            const { results, winner } = action.payload;
            state.results = results;
            state.winner = winner;
        },
        gameStateUpdate: (state, action) => {
            const {
                game_id,
                access_code,
                status,
                players,
                inactivePlayers,
                disconnectedPlayers,
                totalQuestions
            } = action.payload;
            state.game_id = game_id;
            state.access_code = access_code;
            state.status = status;
            state.disconnectedPlayers = disconnectedPlayers;
            state.players = players;
            state.inactivePlayers = inactivePlayers;
            state.totalQuestions = totalQuestions;
        },

        setInactive: (state, action) => {
            state.inactivePlayers = [...action.payload]
        },
        joinGame: (state, action) => {
            const {
                status,
                game_id,
                deck,
                totalQuestions,
                currentHostName,
                players,
                access_code,
                playerId,
                playerName,
                gameToken
            } = action.payload;

            state.status = status;
            state.gameToken = gameToken;
            state.game_id = game_id;
            state.deck = deck;
            state.totalQuestions = totalQuestions;
            state.currentHostName = currentHostName;
            state.players = players.reduce((acc: Record<number, PlayerRef>, player: PlayerRef) => {
                return { ...acc, [player.id]: player }
            }, {});
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
    setGameResults
} = gameSlice.actions;

// selectors
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectIsHost = (state: RootState) => state.game.isHost;
export const selectGameId = (state: RootState) => state.game.game_id;
export const selectGameToken = (state: RootState) => state.game.gameToken;
export const selectGameStatus = (state: RootState) => state.game.status;
export const selectAccessCode = (state: RootState) => state.game.access_code;
export const selectGameDeck = (state: RootState) => state.game.deck;
export const selectPlayerId = (state: RootState) => state.game.playerId;
export const selectInactive = (state: RootState) => state.game.inactivePlayers;
export const selectDisconnected = (state: RootState) => state.game.disconnectedPlayers;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectPlayerList = createSelector(selectPlayers, (players) => {
    return Object.values(players);
})

export default gameSlice.reducer;
