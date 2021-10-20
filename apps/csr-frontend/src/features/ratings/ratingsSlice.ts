import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";
import { RootState } from "../../app/store";

export interface RatingsState {
    hasRatedApp: boolean;
    appRatingChecked: boolean;
}

export const initialRatingsState: RatingsState = {
    hasRatedApp: false,
    appRatingChecked: false // has a request been sent to check if the user has rated the app
};

export const checkHasRatedApp = createAsyncThunk(
    'ratings/checkIfUserHasRated',
    async (_, { rejectWithValue }) => {
        return api.get('/ratings/app').then(response => {
            return response.data
        }).catch(e => {
            console.error(e)
            return rejectWithValue(e)
        })
    }
)

export const ratingsSlice = createSlice({
    name: "ratings",
    initialState: initialRatingsState,
    reducers: {
        setHasRatedApp: (state, action) => {
            state.hasRatedApp = action.payload;
        },
        setAppRatingChecked: (state, action) => {
            state.appRatingChecked = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(checkHasRatedApp.fulfilled, (state, action) => {
            state.hasRatedApp = action.payload.hasRated;
            state.appRatingChecked = true;
        });
    }
});

// actions
export const { setHasRatedApp } = ratingsSlice.actions;

// selectors
export const selectAppRatingChecked = (state: RootState) => state.ratings.appRatingChecked;
export const selectHasRatedApp = (state: RootState) => state.ratings.hasRatedApp;


export default ratingsSlice.reducer;