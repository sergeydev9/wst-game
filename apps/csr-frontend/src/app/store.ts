import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import {
    authReducer,
    chooseNameReducer,
    gameReducer,
    modalReducer,
    decksReducer,
    resetPasswordReducer,
    cartReducer
} from "../features";
import { enhancer } from "addon-redux";
import jwt_decode, { JwtPayload } from "jwt-decode";


const enhancers = process.env.NODE_ENV === 'development' ? [enhancer] : []; // add storybook enhancer if not in prod environment

const stored = localStorage.getItem('wstState')
let persistedState;

try {
    const state = stored ? JSON.parse(stored) : null
    const decoded = jwt_decode(state.auth.token) as JwtPayload

    // if token is expired, don't copy cart or auth from storage
    if (decoded.exp && decoded.exp * 1000 < new Date().getTime()) {
        const { auth, cart, ...noAuthState } = state;
        persistedState = noAuthState
    } else {
        persistedState = state
    }

} catch (e) {
    console.error('invalid token')
    persistedState = {}
}

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chooseName: chooseNameReducer,
        game: gameReducer,
        modals: modalReducer,
        decks: decksReducer,
        resetPassword: resetPasswordReducer,
        cart: cartReducer
    },
    preloadedState: persistedState,
    enhancers
});

// debounce saving to local storage
let storeTimer: ReturnType<typeof setTimeout>;
store.subscribe(() => {
    clearTimeout(storeTimer)
    const { auth, game, cart } = store.getState()

    storeTimer = setTimeout(() => localStorage.setItem('wstState', JSON.stringify({ auth, game, cart })), 50)
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
