import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
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
        setSfw: (state, action) => {
            state.sfwOnly = action.payload
        },
        removeRating: (state, action) => {
            state.movieRatingFilters = state.movieRatingFilters.filter(rating => rating !== action.payload)
        },
        addRating: (state, action) => {
            state.movieRatingFilters = [...state.movieRatingFilters, action.payload]
        }

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
export const { clear, removeRating, addRating, setSfw } = deckSelectionSlice.actions;

// selectors
export const selectMovieRatingFilters = (state: RootState) => state.deckSelection.movieRatingFilters
export const selectSfwOnly = (state: RootState) => state.deckSelection.sfwOnly
export const selectOwned = (state: RootState) => state.deckSelection.owned
export const selectNotOwned = (state: RootState) => state.deckSelection.notOwned

export const movieFilteredtNotOwned = createSelector(selectNotOwned, selectMovieRatingFilters, (decks, filters) => {
    // if no filters have been selected, return all decks
    if (filters.length === 4) {
        return decks
    } else {
        // if any filter has been selected, return only decks that match the filter
        return decks.filter(deck => {
            return filters.every(rating => rating !== deck.movie_rating)
        })
    }

});

export const movieFilteredtOwned = createSelector(selectOwned, selectMovieRatingFilters, (decks, filters) => {
    return decks.filter(deck => {
        return filters.some(rating => rating === deck.movie_rating)
    })
});

export const filteredNotOwned = createSelector(movieFilteredtNotOwned, selectSfwOnly, (decks, sfwOnly) => {
    return decks.filter(deck => deck.sfw === sfwOnly || deck.sfw === true)
})

export const filteredOwned = createSelector(movieFilteredtNotOwned, selectSfwOnly, (decks, sfwOnly) => {
    return decks.filter(deck => deck.sfw === sfwOnly || deck.sfw === true)
})
// default
export default deckSelectionSlice.reducer;