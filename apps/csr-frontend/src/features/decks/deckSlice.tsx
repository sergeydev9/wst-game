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
    movieRatingFilters: ["PG", "PG13", "R"],
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
        },
        setShowAll: (state) => {
            state.showAll = true;
            state.sfwOnly = false;
            state.movieRatingFilters = ["PG", "PG13", "R"];

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

export const movieFilteredNotOwned = createSelector(selectNotOwned, selectMovieRatingFilters, (decks, filters) => {
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

export const movieFilteredOwned = createSelector(selectOwned, selectMovieRatingFilters, (decks, filters) => {
    return decks.filter(deck => {
        return filters.some(rating => rating === deck.movie_rating)
    })
});

export const filteredNotOwned = createSelector(movieFilteredNotOwned, selectSfwOnly, (decks, sfwOnly) => {
    return decks.filter(deck => deck.sfw === sfwOnly || deck.sfw === true)
})

export const filteredOwned = createSelector(movieFilteredOwned, selectSfwOnly, (decks, sfwOnly) => {
    return decks.filter(deck => deck.sfw === sfwOnly || deck.sfw === true)
})
// default
export default deckSlice.reducer;