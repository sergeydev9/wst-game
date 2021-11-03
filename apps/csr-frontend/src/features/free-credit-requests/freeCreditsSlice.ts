import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface FreeCreditRequestState {
    hasRequestedCredits: boolean;
    email: string;
}

export const initialFreeCreditState: FreeCreditRequestState = {
    hasRequestedCredits: false,
    email: ''
};

export const freeCreditSlice = createSlice({
    name: "freeCreditSlice",
    initialState: initialFreeCreditState,
    reducers: {
        requestCreditsForEmail: (state, action) => {
            state.hasRequestedCredits = true;
            state.email = action.payload;
        }

    },
});

export const { requestCreditsForEmail } = freeCreditSlice.actions;
export const selectRequestedCreditsFor = (state: RootState) => state.freeCredits.email;

export default freeCreditSlice.reducer;
