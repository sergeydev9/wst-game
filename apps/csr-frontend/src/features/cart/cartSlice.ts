import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck } from '@whosaidtrue/app-interfaces';

// local imports
import { RootState } from "../../app/store";

export type PurchaseStatus = 'noItem'
    | "hasItem"

export interface CartState {
    status: PurchaseStatus;
    deck: Deck;
    priceInCents: number;
    clientSecret: string; // stripe payment intent secret
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
        movie_rating: 'PG',
        sfw: true,
        thumbnail_url: '',
        purchase_price: ''
    },
    priceInCents: 0,
    clientSecret: ''
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: () => {
            return initialState
        },
        addToCart: (state, action: PayloadAction<Deck>) => {
            const { purchase_price } = action.payload;
            state.deck = action.payload;
            // Price is a string with '$' because it's saved as postgres money type.
            // parse to float here so it can be used in stripe.
            // Also remove period. 2.00 needs to become 200, because
            // Stripe interprets 2 as $0.02
            state.priceInCents = parseFloat(purchase_price.replace(/[^0-9]/g, ""));
        },

        goToCheckout: (state, action) => {
            state.deck = action.payload.deck;
            state.status = 'hasItem';
        },
        setClientSecret: (state, action: PayloadAction<string>) => {
            state.clientSecret = action.payload;
        }
    },

})

export const {
    addToCart,
    clearCart,
    setClientSecret
} = cartSlice.actions;

// selectors
export const selectDeckId = (state: RootState) => state.cart.deck.id;
export const selectCartDeck = (state: RootState) => state.cart.deck;
export const selectClientSecret = (state: RootState) => state.cart.clientSecret;
export const selectPriceInCents = (state: RootState) => state.cart.priceInCents;

export default cartSlice.reducer;
