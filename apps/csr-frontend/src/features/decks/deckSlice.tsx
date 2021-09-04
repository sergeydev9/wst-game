import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { DeckSelectionResponse } from "@whosaidtrue/api-interfaces";
import { Deck, MovieRating, RequestStatus } from "@whosaidtrue/app-interfaces";
import { api } from '../../api';


export interface DeckState {
    getSelectionStatus: RequestStatus;
    getDetailsStatus: RequestStatus;
    sfwOnly: boolean;
    movieRatingFilters: MovieRating[];
    owned: Deck[];
    notOwned: Deck[];
    selectedDeck: Deck;
    isSelectedOwned: boolean;
}

export const initialState: DeckState = {
    getSelectionStatus: 'idle',
    getDetailsStatus: 'idle',
    sfwOnly: false,
    movieRatingFilters: ["G", "PG", "PG-13", "R"],
    owned: [],
    notOwned: [],
    selectedDeck: {
        id: 0,
        name: '',
        sort_order: 0,
        clean: false,
        age_rating: 0,
        status: 'active',
        description: '',
        movie_rating: 'G',
        sfw: true,
        thumbnail_url: '',
        purchase_price: ''
    },
    isSelectedOwned: false
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

export const deckSlice = createSlice({
    name: 'decks',
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
        },
        setSelectedDeck: (state, action) => {
            state.selectedDeck = action.payload.deck
            state.isSelectedOwned = action.payload.isOwned
        },
        clearSelectedDeck: (state) => {
            state.selectedDeck = initialState.selectedDeck;
            state.isSelectedOwned = false
        }
    },
    extraReducers: (builder) => {
        // success
        builder.addCase(getDeckSelection.fulfilled, (state, action) => {
            const { owned, notOwned } = action.payload;
            state.owned = owned;
            state.notOwned = notOwned;
            state.getSelectionStatus = 'idle';
        })

        // error
        builder.addCase(getDeckSelection.rejected, (state, action) => {
            // TODO: figure out error handling. Maybe flash message then redirect?
            console.error(action.payload)
            return initialState
        })
        // loading
        builder.addCase(getDeckSelection.pending, (state, action) => {
            state.getSelectionStatus = 'loading';

        })
    }
})

// actions
export const {
    clear,
    removeRating,
    addRating,
    setSfw,
    setSelectedDeck,
    clearSelectedDeck
} = deckSlice.actions;

// selectors
export const selectMovieRatingFilters = (state: RootState) => state.decks.movieRatingFilters
export const selectSfwOnly = (state: RootState) => state.decks.sfwOnly
export const selectOwned = (state: RootState) => state.decks.owned
export const selectNotOwned = (state: RootState) => state.decks.notOwned
export const getSelectedDeck = (state: RootState) => state.decks.selectedDeck
export const selectIsOwned = (state: RootState) => state.decks.isSelectedOwned

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

export const filteredOwned = createSelector(movieFilteredtOwned, selectSfwOnly, (decks, sfwOnly) => {
    return decks.filter(deck => deck.sfw === sfwOnly || deck.sfw === true)
})
// default
export default deckSlice.reducer;