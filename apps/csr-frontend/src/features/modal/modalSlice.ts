import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";


export type FullModal = "createAccount"
    | "preGameAuth"
    | "login"
    | "deckDetails"
    | "changePassword"
    | "choosePaymentMethod"
    | "freeCreditPurchase"
    | "checkout"
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
    | "info"
    | "success"
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
        showInfo: (state, action) => {
            state.isPersistent = false;
            state.messageType = 'info';
            state.messageContent = action.payload;
        },
        showSuccess: (state, action) => {
            state.isPersistent = false;
            state.messageType = 'success';
            state.messageContent = action.payload;
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

export const {
    setFullModal,
    clearMessage,
    showInfo,
    showSuccess,
    showError
} = modalSlice.actions;
export const selectFullModal = (state: RootState) => state.modals.fullModal;
export const selectMessageType = (state: RootState) => state.modals.messageType;
export const selectMessageContent = (state: RootState) => state.modals.messageContent;
export const selectIsPersistent = (state: RootState) => state.modals.isPersistent;

export default modalSlice.reducer;