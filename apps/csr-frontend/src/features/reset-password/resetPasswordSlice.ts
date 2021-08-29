import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ResetPasswordState {
    email: string;
    error: string;
    token: string
}

const initialState: ResetPasswordState = {
    email: 'test@test.com',
    error: '',
    token: ''
}

const resetSlice = createSlice({
    name: 'passwordReset',
    initialState,
    reducers: {
        clear: () => {
            return initialState
        },
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        }
    }
})

export const { setEmail, setError, setToken, clear } = resetSlice.actions;

export const selectResetEmail = (state: RootState) => state.resetPassword.email
export const selectResetCode = (state: RootState) => state.resetPassword.token
export const selectResetError = (state: RootState) => state.resetPassword.error

export default resetSlice.reducer