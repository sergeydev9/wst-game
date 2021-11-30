import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type FullModal = "createAccount"
    | "preGameAuth"
    | "login"
    | "deckDetails"
    | "changePassword"
    | "choosePaymentMethod"
    | "freeCreditPurchase"
    | "cardCheckout"
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
    | "skipToResults"
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
    // set to true when a user opens login from the deck details modal. This is used to re-open deck details on login success.
    cameFromDeckDetails: boolean;
    fullModal: FullModal;
    messageType: MessageType;
    messageContent: string;
    isPersistent: boolean;
    loaderMessage: string;
    showLoaderMessage: boolean;
    showTakingTooLong: boolean;
    scoreTooltipDismissed: boolean; // sets whether user will see it again next question
    scoreTooltipShowing: boolean; // sets whether should be showing right now

}

export const initialState: ModalState = {
    cameFromDeckDetails: false,
    fullModal: '',
    messageType: '',
    messageContent: '',
    loaderMessage: '',
    showLoaderMessage: false,
    isPersistent: false,
    scoreTooltipDismissed: false,
    scoreTooltipShowing: false,
    showTakingTooLong: false,
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
        setCameFromDeckDetails: (state, action: PayloadAction<boolean>) => {
            state.cameFromDeckDetails = action.payload;
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

        showLoaderMessage: (state, action: PayloadAction<string>) => {
            state.showLoaderMessage = true;
            state.loaderMessage = action.payload;
        },

        clearLoaderMessage: (state) => {
            state.showLoaderMessage = false;
            state.loaderMessage = '';
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
        },
        setShowTakingTooLong: (state, action: PayloadAction<boolean>) => {
            state.showTakingTooLong = action.payload;
        }
    },
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
    showLoaderMessage,
    clearLoaderMessage,
    setShowTakingTooLong,
    setCameFromDeckDetails
} = modalSlice.actions;

// selectors
export const selectFullModal = (state: RootState) => state.modals.fullModal;
export const selectMessageType = (state: RootState) => state.modals.messageType;
export const selectMessageContent = (state: RootState) => state.modals.messageContent;
export const selectIsPersistent = (state: RootState) => state.modals.isPersistent;
export const selectScoreTooltipDismissed = (state: RootState) => state.modals.scoreTooltipDismissed;
export const selectScoreTooltipShowing = (state: RootState) => state.modals.scoreTooltipShowing;
export const selectLoaderMessage = (state: RootState) => state.modals.loaderMessage;
export const selectShowTakingTooLong = (state: RootState) => state.modals.showTakingTooLong;
export const selectCameFromDeckDetails = (state: RootState) => state.modals.cameFromDeckDetails;

export default modalSlice.reducer;