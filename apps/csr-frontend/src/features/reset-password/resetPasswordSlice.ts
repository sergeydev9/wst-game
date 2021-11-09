import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ResetPasswordState {
    email: string;
    token: string
}

const initialState: ResetPasswordState = {
    email: '',
    token: ''
}

const resetSlice = createSlice({
    name: 'passwordReset',
    initialState,
    reducers: {
        clearReset: () => {
            return initialState
        },
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        }
    }
})

export const { setEmail, setToken, clearReset } = resetSlice.actions;

export const selectResetEmail = (state: RootState) => state.resetPassword.email
export const selectResetToken = (state: RootState) => state.resetPassword.token

export default resetSlice.reducer