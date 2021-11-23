import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { NameObject } from "@whosaidtrue/app-interfaces";
import { api } from "../../api";
import { NameChoiceReport } from "@whosaidtrue/api-interfaces";
import { clearGame } from '../game/gameSlice';

export interface ChooseNameState {
    remainingNameOptions: NameObject[]; // remainining options
    rerolls: number;
    seen: NameObject[];
    currentNameOptions: NameObject[]; // name options currently being shown. Max 3
}

export const initialState: ChooseNameState = {
    remainingNameOptions: [],
    rerolls: 0,
    currentNameOptions: [],
    seen: []
}

export const sendReport = createAsyncThunk(
    'chooseName/sendNameReport',
    async (report: NameChoiceReport) => {
        return api.patch('/names/report', report).then(res => {
            return
        }).catch(e => {
            return // fail silently
        })
    }
)

export const chooseNameSlice = createSlice({
    name: 'chooseName',
    initialState,
    reducers: {
        clearNameChoices: () => {
            return initialState;
        },
        setRemainingNameOptions: (state, action) => {
            state.remainingNameOptions = action.payload;
            state.rerolls = action.payload.length;
        },
        setCurrentNameOptions: (state) => {
            const newCurrent = state.remainingNameOptions.slice(0, 3);
            const newRemaining = state.remainingNameOptions.filter(el => newCurrent.every(item => item.id !== el.id)) // remove current options from set of remaining options.
            state.currentNameOptions = newCurrent // First 3 remainingOptions are the new current options.
            state.remainingNameOptions = newRemaining;
            state.rerolls = newRemaining.length;
            state.seen = [...state.seen, ...newCurrent]
        },
    },
});

// actions
export const { setCurrentNameOptions, setRemainingNameOptions, clearNameChoices } = chooseNameSlice.actions;

// selectors
export const selectNameRerolls = (state: RootState) => state.chooseName.rerolls;
export const selectCurrentNameOptions = (state: RootState) => state.chooseName.currentNameOptions;
export const selectSeen = (state: RootState) => state.chooseName.seen;


export const chooseNameReducer = chooseNameSlice.reducer;