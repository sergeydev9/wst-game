import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ResetPasswordState {
    email: string;
    error: string;
    code: string;
}

const initialState: ResetPasswordState = {
    email: '',
    error: '',
    code: ''
}

const resetSlice = createSlice({
    name: 'passwordReset',
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setCode: (state, action) => {
            state.code = action.payload
        }
    }
})

export const { setEmail, setError, setCode } = resetSlice.actions;

export const selectResetEmail = (state: RootState) => state.resetPassword.email
export const selectResetCode = (state: RootState) => state.resetPassword.code
export const selectResetError = (state: RootState) => state.resetPassword.error

export default resetSlice.reducer