import { createSlice, createAsyncThunk, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { DeckSelectionResponse } from "@whosaidtrue/api-interfaces";
import { Deck } from "@whosaidtrue/app-interfaces";
import { api } from '../../api';
import { showError } from "../modal/modalSlice";
import { sortNotForSchools, sortForSchools } from '../../util/functions';

export type DeckSet = 'all' | 'sfw' | 'PG' | 'PG13' | 'R' | 'NC17';

export interface DeckState {
    currentSetName: DeckSet;
    owned: Deck[];
    notOwned: Deck[];
    ownedByRating: Record<DeckSet, Deck[]>;
    notOwnedByRating: Record<DeckSet, Deck[]>;
    selectedDeck: Deck;
    isSelectedOwned: boolean;
}

export const initialState: DeckState = {
    currentSetName: 'all',
    owned: [],
    notOwned: [],
    ownedByRating: {
        "all": [],
        "PG": [],
        "NC17": [],
        "PG13": [],
        "R": [],
        "sfw": []
    },
    notOwnedByRating: {
        "all": [],
        "PG": [],
        "NC17": [],
        "PG13": [],
        "R": [],
        "sfw": []
    },
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
        purchase_price: '',
        sample_question: ''
    },
    isSelectedOwned: false
}

export const getDeckSelection = createAsyncThunk(
    'decks/getSelection',
    async (_, { dispatch, rejectWithValue }) => {

        // build time var determines whether returned decks are all clean or all not clean
        const url = process.env.NX_IS_FOR_SCHOOLS === 'true' ? `/decks/selection?clean=true` : `/decks/selection?clean=false`

        return api.get<DeckSelectionResponse>(url).then(res => {
            return res.data;
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

            const ownedSfw: Deck[] = [];
            const ownedR: Deck[] = [];
            const ownedPG: Deck[] = [];
            const ownedPG13: Deck[] = [];
            const ownedNC17: Deck[] = [];

            owned.forEach((deck: Deck) => {
                if (deck.sfw) {
                    ownedSfw.push(deck);
                }
                switch (deck.movie_rating) {
                    case 'NC17':
                        ownedNC17.push(deck);
                        break;
                    case 'R':
                        ownedR.push(deck);
                        break;
                    case 'PG13':
                        ownedPG13.push(deck);
                        break;
                    case 'PG':
                        ownedPG.push(deck);
                        break;
                }

            })

            const notOwnedSfw: Deck[] = [];
            const notOwnedR: Deck[] = [];
            const notOwnedPG: Deck[] = [];
            const notOwnedPG13: Deck[] = [];
            const notOwnedNC17: Deck[] = [];

            notOwned.forEach((deck: Deck) => {
                if (deck.sfw) {
                    notOwnedSfw.push(deck);
                }

                switch (deck.movie_rating) {
                    case 'NC17':
                        notOwnedNC17.push(deck);
                        break;
                    case 'R':
                        notOwnedR.push(deck);
                        break;
                    case 'PG13':
                        notOwnedPG13.push(deck);
                        break;
                    case 'PG':
                        notOwnedPG.push(deck);
                        break;
                }
            })

            state.ownedByRating.all = owned;
            state.ownedByRating.NC17 = ownedNC17;
            state.ownedByRating.PG = ownedPG;
            state.ownedByRating.PG13 = ownedPG13;
            state.ownedByRating.R = ownedR;
            state.ownedByRating.sfw = ownedSfw;

            state.notOwnedByRating.all = notOwned;
            state.notOwnedByRating.NC17 = notOwnedNC17;
            state.notOwnedByRating.PG = notOwnedPG;
            state.notOwnedByRating.PG13 = notOwnedPG13;
            state.notOwnedByRating.R = notOwnedR;
            state.notOwnedByRating.sfw = notOwnedSfw;

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
export const selectOwnedByRating = (state: RootState) => state.decks.ownedByRating;
export const selectNotOwnedByRating = (state: RootState) => state.decks.notOwnedByRating;

export const selectCurrentOwned = createSelector([selectCurrentSetName, selectOwnedByRating], (name, decks) => {
    const isForSchools = process.env.NX_IS_FOR_SCHOOLS === 'true'; // sort decks depending on env variable at build time.
    return isForSchools ? sortForSchools(decks[name].slice()) : sortNotForSchools(decks[name].slice());
})

export const selectCurrentNotOwned = createSelector([selectCurrentSetName, selectNotOwnedByRating], (name, decks) => {
    const isForSchools = process.env.NX_IS_FOR_SCHOOLS === 'true'; // sort decks depending on env variable at build time.
    return isForSchools ? sortForSchools(decks[name].slice()) : sortNotForSchools(decks[name].slice());
})

// default
export default deckSlice.reducer;
