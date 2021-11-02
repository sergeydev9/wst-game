import { createSlice, createAsyncThunk, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { DeckSelectionResponse } from "@whosaidtrue/api-interfaces";
import { Deck } from "@whosaidtrue/app-interfaces";
import { api } from '../../api';
import { showError } from "../modal/modalSlice";

export type DeckSet = 'all' | 'sfw' | 'PG' | 'PG13' | 'R' | 'NC17';

export interface DeckState {
    currentSetName: DeckSet;
    owned: Deck[];
    notOwned: Deck[];
    selectedDeck: Deck;
    isSelectedOwned: boolean;
}

export const initialState: DeckState = {
    currentSetName: 'all',
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

        setCurrentSet: (state, action: PayloadAction<DeckSet>) => {
            state.currentSetName = action.payload;
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
    setSelectedDeck,
    clearSelectedDeck,
    setCurrentSet
} = deckSlice.actions;

// selectors
export const selectOwned = (state: RootState) => state.decks.owned;
export const selectNotOwned = (state: RootState) => state.decks.notOwned;
export const getSelectedDeck = (state: RootState) => state.decks.selectedDeck;
export const selectIsOwned = (state: RootState) => state.decks.isSelectedOwned;
export const selectCurrentSetName = (state: RootState) => state.decks.currentSetName;

export const selectCurrentOwned = createSelector([selectCurrentSetName, selectOwned], (name, decks) => {

    switch (name) {
        case 'all':
            return decks;

        case 'sfw':
            return decks.filter(deck => deck.sfw)

        default:
            return decks.filter(deck => deck.movie_rating === name)
    }

})

export const selectCurrentNotOwned = createSelector([selectCurrentSetName, selectNotOwned], (name, decks) => {

    switch (name) {
        case 'all':
            return decks;

        case 'sfw':
            return decks.filter(deck => deck.sfw)

        default:
            return decks.filter(deck => deck.movie_rating === name)
    }

})



// default
export default deckSlice.reducer;