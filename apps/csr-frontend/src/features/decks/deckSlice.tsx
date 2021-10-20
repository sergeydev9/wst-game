import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { DeckSelectionResponse } from "@whosaidtrue/api-interfaces";
import { Deck, MovieRating } from "@whosaidtrue/app-interfaces";
import { api } from '../../api';
import { showError } from "../modal/modalSlice";

export interface DeckState {
    sfwOnly: boolean;
    showAll: boolean;
    movieRatingFilters: MovieRating[];
    owned: Deck[];
    notOwned: Deck[];
    selectedDeck: Deck;
    isSelectedOwned: boolean;
}

export const initialState: DeckState = {
    sfwOnly: false,
    showAll: true,
    movieRatingFilters: [],
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
        movie_rating: 'PG',
        sfw: true,
        thumbnail_url: '',
        purchase_price: ''
    },
    isSelectedOwned: false
}

export const getDeckSelection = createAsyncThunk(
    'decks/getSelection',
    async (_, { dispatch, rejectWithValue }) => {
        return api.get<DeckSelectionResponse>('/decks/selection').then(res => {
            return res.data
        }).catch(e => {
            console.error(e)
            dispatch(showError("Oops, something went wrong. Please try again later."))
            return rejectWithValue(e.message)
        })

    }
)

export const deckSlice = createSlice({
    name: 'decks',
    initialState,
    reducers: {
        clearDecks: () => {
            return initialState;
        },
        setSfw: (state, action) => {
            state.sfwOnly = action.payload

            if (action.payload) {
                state.showAll = false;
            }

            if (!action.payload && !state.movieRatingFilters.length) {
                state.showAll = true;
            }
        },
        setShowAll: (state) => {
            state.showAll = true;
            state.sfwOnly = false;
            state.movieRatingFilters = [];

        },
        removeRating: (state, action) => {
            const filters = state.movieRatingFilters.filter(rating => rating !== action.payload);

            if (!filters.length && !state.sfwOnly) {
                state.showAll = true;
            }
            state.movieRatingFilters = filters;
        },
        addRating: (state, action) => {
            state.showAll = false;
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
        })


    }
})

// actions
export const {
    clearDecks,
    removeRating,
    addRating,
    setSfw,
    setSelectedDeck,
    clearSelectedDeck,
    setShowAll
} = deckSlice.actions;

// selectors
export const selectShowAll = (state: RootState) => state.decks.showAll;
export const selectMovieRatingFilters = (state: RootState) => state.decks.movieRatingFilters;
export const selectSfwOnly = (state: RootState) => state.decks.sfwOnly;
export const selectOwned = (state: RootState) => state.decks.owned;
export const selectNotOwned = (state: RootState) => state.decks.notOwned;
export const getSelectedDeck = (state: RootState) => state.decks.selectedDeck;
export const selectIsOwned = (state: RootState) => state.decks.isSelectedOwned;
export const selectShouldApplyFilters = (state: RootState) => state.decks.movieRatingFilters.length > 0;


export const sfwOwned = createSelector(selectOwned, (decks) => {
    return decks.filter(deck => deck.sfw === true);
})

export const sfwNotOwned = createSelector(selectNotOwned, (decks) => {
    return decks.filter(deck => deck.sfw === false);
})

export const movieFilteredNotOwned = createSelector(selectNotOwned, selectMovieRatingFilters, (decks, filters) => {
    return decks.filter(deck => {
        return filters.some(rating => rating === deck.movie_rating)
    })
});

export const movieFilteredOwned = createSelector(selectOwned, selectMovieRatingFilters, (decks, filters) => {
    return decks.filter(deck => {
        return filters.some(rating => rating === deck.movie_rating)
    })
});

export const movieFilteredSFWOwned = createSelector(sfwOwned, selectMovieRatingFilters, (decks, filters) => {
    return decks.filter(deck => {
        return filters.some(rating => rating === deck.movie_rating)
    })
});

export const movieFilteredSFWNotOwned = createSelector(sfwNotOwned, selectMovieRatingFilters, (decks, filters) => {
    return decks.filter(deck => {
        return filters.some(rating => rating === deck.movie_rating)
    })
});

// default
export default deckSlice.reducer;