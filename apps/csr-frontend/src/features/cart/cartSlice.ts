import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Deck } from '@whosaidtrue/app-interfaces';
import { BuyWithCreditsRequest } from "@whosaidtrue/api-interfaces";
import { api } from '../../api';

// local imports
import { RootState } from "../../app/store";

export type PurchaseStatus = 'noItem'
    | "hasItem"
    | "completed"
    | "rejected"
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

export const buyWithCredits = createAsyncThunk(
    'cart/buyWithCredits',
    async (deckId: number, thunkApi) => {
        try {
            const response = await api.post('/purchase/credit', { deckId } as BuyWithCreditsRequest)
            return response.data;
        } catch (e) {
            thunkApi.rejectWithValue(e.response.data)
        }
    }
)

// export const buyWithMoney = createAsyncThunk(
//     'cart/buyWithMoney',
//     async (deckId:number, thunkApi) => {

//     }
// )

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
} = cartSlice.actions;

// selectors
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectDeckId = (state: RootState) => state.cart.deck.id;

export default cartSlice.reducer;
