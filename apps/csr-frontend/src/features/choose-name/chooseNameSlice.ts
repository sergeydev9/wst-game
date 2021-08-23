import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ChooseNameState {
    remainingOptions: string[]; // remainining options
    rerolls: number;
    currentOptions: string[]; // name options currently being shown. Max 3
}

export const initialState: ChooseNameState = {
    remainingOptions: [],
    rerolls: 0,
    currentOptions: [],
}

export const chooseNameSlice = createSlice({
    name: 'chooseName',
    initialState,
    reducers: {
        clear: () => {
            return initialState;
        },
        setRemainingOptions: (state, action) => {
            state.remainingOptions = action.payload;
            state.rerolls = Math.floor(action.payload.length / 3);
        },
        setCurrentOptions: (state) => {
            const newCurrent = state.remainingOptions.slice(0, 3);
            const newRemaining = state.remainingOptions.filter(el => newCurrent.every(item => item !== el)) // remove current options from set of remaining options.
            state.currentOptions = newCurrent // First 3 remainingOptions are the new current options.
            state.remainingOptions = newRemaining;
            state.rerolls = Math.floor(newRemaining.length / 3);
        }
    }
});

// actions
export const { setCurrentOptions, setRemainingOptions } = chooseNameSlice.actions;

// selectors
export const selectRerolls = (state: RootState) => state.chooseName.rerolls;
export const selectCurrentOptions = (state: RootState) => state.chooseName.currentOptions;


export default chooseNameSlice.reducer;