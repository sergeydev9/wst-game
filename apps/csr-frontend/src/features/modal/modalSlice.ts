import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { clearError } from "../auth/authSlice";

export interface ModalState {
    login: boolean;
    createAcc: boolean;
}

export const initialState: ModalState = {
    login: false,
    createAcc: false
}

/**
 * Close all modals and clear the error state on auth
 * Call this instead of close modals directly.
 * This is to avoid a situation where when a user
 * receives an error message on one modal, and
 * immediately opens another modal, they would see
 * their old error message displayed on the new modal.
 */
export const closeModalsThunk = createAsyncThunk(
    'modals/closeThunk',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(clearError());
        thunkAPI.dispatch(closeModals())
    }
)

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