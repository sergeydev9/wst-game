import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroupComparison } from "@whosaidtrue/app-interfaces";
import { payloads } from "@whosaidtrue/api-interfaces";
import { RootState } from "../../app/store";

export interface FunFactsState {
    bucketList: GroupComparison
    groupVworld: GroupComparison
}

export const initialFunFactstState: FunFactsState = {
    bucketList: {
        textForGuess: '',
        globalTrue: 0,
        groupTrue: 0
    },
    groupVworld: {
        textForGuess: '',
        globalTrue: 0,
        groupTrue: 0
    }
};

export const funFactsSlice = createSlice({
    name: "funFactsSlice",
    initialState: initialFunFactstState,
    reducers: {
        clearFunFacts: () => {
            return initialFunFactstState
        },
        setFunFacts: (state, action: PayloadAction<payloads.FunFacts>) => {
            const { bucketList, groupVworld } = action.payload;
            state.bucketList = bucketList;
            state.groupVworld = groupVworld;
        }

    },
});

export const { clearFunFacts, setFunFacts } = funFactsSlice.actions;
export const selectBucketList = (state: RootState) => state.funFacts.bucketList;
export const selectGroupVworld = (state: RootState) => state.funFacts.groupVworld;

export default funFactsSlice.reducer;
