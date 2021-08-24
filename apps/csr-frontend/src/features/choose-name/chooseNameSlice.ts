import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface ChooseNameState {
    remainingNameOptions: string[]; // remainining options
    rerolls: number;
    currentNameOptions: string[]; // name options currently being shown. Max 3
}

export const initialState: ChooseNameState = {
    remainingNameOptions: [],
    rerolls: 0,
    currentNameOptions: [],
}

export const chooseNameSlice = createSlice({
    name: 'chooseName',
    initialState,
    reducers: {
        clear: () => {
            return initialState;
        },
        setRemainingNameOptions: (state, action) => {
            state.remainingNameOptions = action.payload;
            state.rerolls = Math.floor(action.payload.length / 3);
        },
        setCurrentNameOptions: (state) => {
            const newCurrent = state.remainingNameOptions.slice(0, 3);
            const newRemaining = state.remainingNameOptions.filter(el => newCurrent.every(item => item !== el)) // remove current options from set of remaining options.
            state.currentNameOptions = newCurrent // First 3 remainingOptions are the new current options.
            state.remainingNameOptions = newRemaining;
            state.rerolls = Math.floor(newRemaining.length / 3);
        }
    }
});

// actions
export const { setCurrentNameOptions, setRemainingNameOptions } = chooseNameSlice.actions;

// selectors
export const selectNameRerolls = (state: RootState) => state.chooseName.rerolls;
export const selectCurrentNameOptions = (state: RootState) => state.chooseName.currentNameOptions;


export const chooseNameReducer = chooseNameSlice.reducer;