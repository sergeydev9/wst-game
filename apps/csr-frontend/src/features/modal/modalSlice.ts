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
    | "confirmSkipQuestion"
    | "confirmTakeOverReading"
    | "announceWinner"
    | "freeCreditEmailInUseError"
    | "checkYourEmail"
    | "submitQuestion"
    | ""

export type MessageType = ''
    | "error"
    | "info"
    | "success"
    | "playerJoined"
    | "playerLeft"
    | "playerRemoved"
    | "scoreToolTip"


export interface ModalState {
    fullModal: FullModal;
    messageType: MessageType;
    messageContent: string;
    isPersistent: boolean;
    scoreTooltipDismissed: boolean; // sets whether user will see it again next question
    scoreTooltipShowing: boolean; // sets whether should be showing right now

}

export const initialState: ModalState = {
    fullModal: '',
    messageType: '',
    messageContent: '',
    isPersistent: false,
    scoreTooltipDismissed: false,
    scoreTooltipShowing: false
}

export const modalSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.messageType = '';
            state.messageContent = '';
            state.isPersistent = false;
        },

        // to open a modal, pass it's name to this
        // to close all modals, pass an empty string
        // only 1 full screen modal can be open at a time
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

        showPlayerJoined: (state, action) => {
            state.messageType = 'playerJoined';
            state.messageContent = `${action.payload} has joined the game!`;
            state.isPersistent = false;
        },
        showPlayerLeft: (state, action) => {
            state.messageType = 'playerLeft';
            state.messageContent = `${action.payload} has left the game`;
            state.isPersistent = false;
        },
        showPlayerRemoved: (state, action) => {
            state.messageType = 'playerRemoved';
            state.messageContent = `${action.payload} has been removed from the game`;
            state.isPersistent = false;
        },
        setShowScoreTooltip: (state, action) => {
            state.scoreTooltipShowing = action.payload;
        },
        dismissScoreTooltip: (state) => {
            state.scoreTooltipDismissed = true;
            state.scoreTooltipShowing = false;
        },
        clearScoreTooltipDismissed: (state) => { // so that the tooltip will show again next game
            state.scoreTooltipDismissed = false;
        }
    }
})

// actions
export const {
    setFullModal,
    clearMessage,
    showInfo,
    showSuccess,
    showError,
    showPlayerJoined,
    showPlayerLeft,
    showPlayerRemoved,
    setShowScoreTooltip,
    dismissScoreTooltip,
    clearScoreTooltipDismissed,
} = modalSlice.actions;

// selectors
export const selectFullModal = (state: RootState) => state.modals.fullModal;
export const selectMessageType = (state: RootState) => state.modals.messageType;
export const selectMessageContent = (state: RootState) => state.modals.messageContent;
export const selectIsPersistent = (state: RootState) => state.modals.isPersistent;
export const selectScoreTooltipDismissed = (state: RootState) => state.modals.scoreTooltipDismissed;
export const selectScoreTooltipShowing = (state: RootState) => state.modals.scoreTooltipShowing;

export default modalSlice.reducer;