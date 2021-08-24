import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { authReducer, chooseNameReducer, gameReducer, modalReducer, deckSelectionReducer } from "../features";
import { enhancer } from "addon-redux";

const enhancers = process.env.NODE_ENV === 'production' ? [] : [enhancer]; // add storybook enhancer if not in prod environment

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chooseName: chooseNameReducer,
        game: gameReducer,
        modals: modalReducer,
        deckSelection: deckSelectionReducer
    },
    enhancers
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
