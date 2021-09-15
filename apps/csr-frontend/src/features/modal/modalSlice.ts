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
    | "confirmEndGame"
    | "removePlayers"
    | "confirmLeaveGame"
    | "guestAccountRedirect"
    | "reportAnIssue"
    | "confirmRemovePlayer"
    | ""

export type MessageType = ''
    | "error"
    | "playerJoined"


export interface ModalState {
    fullModal: FullModal;
    messageType: MessageType;
    messageContent: string;
    isPersistent: boolean;

}

export const initialState: ModalState = {
    fullModal: '',
    messageType: '',
    messageContent: '',
    isPersistent: false
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
        },
        setMessageType: (state, action) => {
            state.messageType = action.payload
        },
        setMessageContent: (state, action) => {
            state.messageContent = action.payload
        },
        showError: (state, action) => {
            state.isPersistent = false;
            state.messageType = 'error';
            state.messageContent = action.payload;
        },
        clearMessage: (state) => {
            state.messageType = ''
            state.messageContent = ''
            state.isPersistent = false
        }
    }
})

export const { setFullModal, setMessageType, setMessageContent, clearMessage, showError } = modalSlice.actions;
export const selectFullModal = (state: RootState) => state.modals.fullModal;
export const selectMessageType = (state: RootState) => state.modals.messageType;
export const selectMessageContent = (state: RootState) => state.modals.messageContent;
export const selectIsPersistent = (state: RootState) => state.modals.isPersistent;

export default modalSlice.reducer;