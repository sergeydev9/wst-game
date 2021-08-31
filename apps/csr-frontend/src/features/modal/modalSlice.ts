import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { clearError } from "../auth/authSlice";
import { setCheckoutModalState } from "../cart/cartSlice";

export interface ModalState {
    login: boolean;
    createAcc: boolean;
    changePass: boolean;
    preGameAuth: boolean

}

export const initialState: ModalState = {
    login: false,
    createAcc: false,
    changePass: false,
    preGameAuth: false
}

/**
 * Close all modals and clear the error state on auth
 * Call this instead of close modals directly.
 * This is to avoid a situation where when a user
 * receives an error message on one modal, and
 * immediately opens another modal. They would see
 * their old error message displayed on the new modal
 * if both modals include the auth form component
 * since that form gets its error message from the redux store.
 */
export const closeModalsThunk = createAsyncThunk(
    'modals/closeThunk',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState

        // if there is an item in the cart, open checkout
        if (state.cart?.status !== 'noItem') {
            thunkAPI.dispatch(setCheckoutModalState(true))
        }
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
            state.createAcc = false
            state.login = true
            state.changePass = false
            state.preGameAuth = false
        },
        openCreateAcc: (state) => {
            state.createAcc = true
            state.login = false
            state.changePass = false
            state.preGameAuth = false
        },
        openChangePass: (state) => {
            state.changePass = true
            state.createAcc = false
            state.login = false
            state.preGameAuth = false
        },
        openPreGameAuth: (state) => {
            state.preGameAuth = true
            state.changePass = true
            state.createAcc = false
            state.login = false
        }

    }
})

export const { closeModals, openLogin, openCreateAcc, openChangePass, openPreGameAuth } = modalSlice.actions
export const selectLoginOpen = (state: RootState) => state.modals.login;
export const selectCreateAcc = (state: RootState) => state.modals.createAcc;
export const selectChangePass = (state: RootState) => state.modals.changePass;


export default modalSlice.reducer