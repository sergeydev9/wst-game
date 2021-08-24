import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { DeckSelectionResponse } from "@whosaidtrue/api-interfaces";
import { Deck, MovieRating } from "@whosaidtrue/app-interfaces";
import { api } from '../../api';

export type DeckSelectionStatus = 'idle' | 'loading'

export interface DeckSelectionState {
    status: DeckSelectionStatus;
    sfwOnly: boolean;
    movieRatingFilters: MovieRating[];
    owned: Deck[];
    notOwned: Deck[]
}

export const initialState: DeckSelectionState = {
    status: 'idle',
    sfwOnly: false,
    movieRatingFilters: ["G", "PG", "PG-13", "R"],
    owned: [],
    notOwned: []
}

export const getDeckSelection = createAsyncThunk(
    'decks/getSelection',
    async (_, { rejectWithValue }) => {
        let response;
        try {
            response = await api.get<DeckSelectionResponse>('/decks/selection');
            return response.data as DeckSelectionResponse

        } catch (e) {
            return rejectWithValue(e)
        }
    }
)

export const deckSelectionSlice = createSlice({
    name: 'deckSelection',
    initialState,
    reducers: {
        clear: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        // success
        builder.addCase(getDeckSelection.fulfilled, (state, action) => {
            state.owned = action.payload.owned;
            state.notOwned = action.payload.notOwned;
            state.status = 'idle';
        })

        // error
        builder.addCase(getDeckSelection.rejected, (state, action) => {
            // TODO: figure out error handling. Maybe flash message then redirect?
            console.error(action.payload)
            return initialState
        })
        // loading
        builder.addCase(getDeckSelection.pending, (state, action) => {
            state.status = 'loading';

        })
    }
})

// actions
export const { clear } = deckSelectionSlice.actions;

// selectors
export const selectOwned = (state: RootState) => {

    return state.deckSelection.owned.filter(deck => {
        return (deck.sfw === state.deckSelection.sfwOnly || deck.sfw === true) && state.deckSelection.movieRatingFilters.some(rating => rating === deck.movie_rating)
    })
};
export const selectNotOwned = (state: RootState) => {

    return state.deckSelection.notOwned.filter(deck => {
        return (deck.sfw === state.deckSelection.sfwOnly || deck.sfw === true) && state.deckSelection.movieRatingFilters.some(rating => rating === deck.movie_rating)
    })
};
// default
export default deckSelectionSlice.reducer;