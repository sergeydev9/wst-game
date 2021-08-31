import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import {
    authReducer,
    chooseNameReducer,
    gameReducer,
    modalReducer,
    decksReducer,
    resetPasswordReducer
} from "../features";
import { enhancer } from "addon-redux";

const enhancers = process.env.NODE_ENV === 'production' ? [] : [enhancer]; // add storybook enhancer if not in prod environment

const stored = localStorage.getItem('wstState')
const persistedState = stored ? JSON.parse(stored) : {}

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chooseName: chooseNameReducer,
        game: gameReducer,
        modals: modalReducer,
        decks: decksReducer,
        resetPassword: resetPasswordReducer
    },
    preloadedState: persistedState,
    enhancers
});

// debounce saving to local storage
let storeTimer: ReturnType<typeof setTimeout>;
store.subscribe(() => {
    clearTimeout(storeTimer)
    const { auth, game } = store.getState();

    storeTimer = setTimeout(() => localStorage.setItem('wstState', JSON.stringify({ auth, game })), 50)
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
