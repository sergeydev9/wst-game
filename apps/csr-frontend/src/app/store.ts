import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import {
    authReducer,
    chooseNameReducer,
    gameReducer,
    modalReducer,
    decksReducer,
    resetPasswordReducer,
    cartReducer,
    questionReducer,
    hostReducer,
    freeCreditsReducer,
    ratingsReducer,
    funFactsReducer
} from "../features";
import { enhancer } from "addon-redux";
import jwt_decode, { JwtPayload } from "jwt-decode";

declare global {
    interface Window { Cypress: any, store: any }
}

const enhancers = process.env.NODE_ENV === 'development' ? [enhancer] : []; // add storybook enhancer if not in prod environment

const stored = localStorage.getItem('wstState');
let persistedState;

try {
    persistedState = stored ? JSON.parse(stored) : {}

    //if there is a token, check if expired
    if (persistedState && persistedState.auth && persistedState.auth.token) {
        const decoded = jwt_decode(persistedState.auth.token) as JwtPayload;

        // if token is expired, remove authentication data from store
        if (decoded.exp && decoded.exp * 1000 < new Date().getTime()) {
            const { auth, cart, ...noAuthState } = persistedState;
            persistedState = noAuthState;
        }
    }

} catch (e) {
    console.error('invalid token');
    persistedState = {};
}

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chooseName: chooseNameReducer,
        game: gameReducer,
        modals: modalReducer,
        decks: decksReducer,
        resetPassword: resetPasswordReducer,
        cart: cartReducer,
        question: questionReducer,
        host: hostReducer,
        freeCredits: freeCreditsReducer,
        ratings: ratingsReducer,
        funFacts: funFactsReducer
    },
    preloadedState: persistedState,
    enhancers
});


// if in a cypress run, add store to window so that cypress can access it during tests.
if (window.Cypress) {
    window.store = store
}

// debounce saving to local storage
let storeTimer: ReturnType<typeof setTimeout>;
store.subscribe(() => {
    clearTimeout(storeTimer)
    const { auth, game, question, freeCredits, ratings, modals, funFacts } = store.getState()
    storeTimer = setTimeout(() => {
        localStorage.setItem(
            'wstState',
            JSON.stringify({
                auth,
                game,
                question,
                freeCredits,
                ratings,
                funFacts,
                modals: { ...modals, reconnecting: false, isPersistent: false, connecting: false }  // remove unwanted properties
            }))
    }, 50)
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
