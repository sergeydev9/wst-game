import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ModalState {
    login: boolean;
    createAcc: boolean;
}

export const initialState: ModalState = {
    login: false,
    createAcc: false
}

export const modalSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        closeModals: () => {
            return initialState;
        },
        openLogin: (state) => {
            state.login = true
        },
        openCreateAcc: (state) => {
            state.createAcc = true
        }
    }
})

export const { closeModals, openLogin, openCreateAcc } = modalSlice.actions

export const selectLoginOpen = (state: RootState) => state.modals.login;
export const selectCreateAcc = (state: RootState) => state.modals.createAcc;

export default modalSlice.reducer