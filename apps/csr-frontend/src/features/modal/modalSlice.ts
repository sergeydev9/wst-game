import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { clearError } from "../auth/authSlice";


export type FullModal = "createAccount"
    | "preGameAuth"
    | "login"
    | "deckDetails"
    | "changePassword"
    | "choosePaymentMethod"
    | "freeCreditPurchase"
    | "cardPurchase"
    | "payPal"
    | "applePay"
    | "googlePay"
    | "purchaseSuccess"
    | "removedFromGame"
    | "freeCreditAward"
    | "gameOptions"
    | ""

export interface ModalState {
    fullModal: FullModal
    messageModal: string

}

export const initialState: ModalState = {
    fullModal: '',
    messageModal: ''
}

export const closeModalsThunk = createAsyncThunk(
    'modals/closeThunk',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState

        // if there is an item in the cart, open checkout
        if (state.cart?.status !== 'noItem') {
            thunkAPI.dispatch(setFullModal('choosePaymentMethod'))
        }
        thunkAPI.dispatch(clearError());
        thunkAPI.dispatch(setFullModal(''))
    }
)

export const modalSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        // to open a modal, pass it's name to this
        // to close all modals, pass an empty string
        // only 1 modal can be open at a time
        setFullModal: (state, action) => {
            state.fullModal = action.payload
        }
    }
})

export const { setFullModal } = modalSlice.actions
export const selectFullModal = (state: RootState) => state.modals.fullModal;

export const selectFullModalFactory = (modal: FullModal) => createSelector(selectFullModal, (fullModal) => fullModal === modal)

export default modalSlice.reducer