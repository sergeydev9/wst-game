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
    isCheckoutModalOpen: boolean;

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
    isCheckoutModalOpen: false
}

export const buyWithCredits = createAsyncThunk(
    'cart/buyWithCredits',
    async (deckId: number, thunkApi) => {
        try {
            const response = await api.post('/games/create', { deckId } as BuyWithCreditsRequest)
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
        setCheckoutModalState: (state, action) => {
            state.isCheckoutModalOpen = action.payload
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
            state.isCheckoutModalOpen = true
        }
    },

})

export const {
    addToCart,
    setCheckoutModalState,
    clearCart,
    goToCheckout
} = cartSlice.actions;

// selectors
export const selectIsCartModalOpen = (state: RootState) => state.cart.isCheckoutModalOpen;
export const selectCartStatus = (state: RootState) => state.cart.status;

export default cartSlice.reducer;
