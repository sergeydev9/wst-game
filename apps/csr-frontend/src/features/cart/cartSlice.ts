import { createSlice } from "@reduxjs/toolkit";
import { Deck } from '@whosaidtrue/app-interfaces';

// local imports
import { RootState } from "../../app/store";

// TODO: remove unnecessary statuses when this feature is finished
export type PurchaseStatus = 'noItem'
    | "hasItem"
    | "success"
    | "rejected"
    | "pending"
    | "error"
    | "cancelled"

export interface CartState {
    status: PurchaseStatus;
    deck: Deck;
}

export const initialState: CartState = {
    status: 'noItem',
    deck: {
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
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: () => {
            return initialState
        },
        addToCart: (state, action) => {
            state.deck = action.payload
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        goToCheckout: (state, action) => {
            state.deck = action.payload.deck
            state.status = 'hasItem'
        },
    },

})

export const {
    addToCart,
    clearCart,
    setStatus
} = cartSlice.actions;

// selectors
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectDeckId = (state: RootState) => state.cart.deck.id;
export const selectCartDeck = (state: RootState) => state.cart.deck;

export default cartSlice.reducer;
