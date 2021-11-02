import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroupComparison } from "@whosaidtrue/app-interfaces";
import { payloads } from "@whosaidtrue/api-interfaces";
import { RootState } from "../../app/store";
import { clearGame } from "..";

type FetchingStatus = 'unsent' | 'loading' | 'success' | 'error'
export interface FunFactsState {
    fetchSimilarStatus: FetchingStatus;
    bucketList: GroupComparison;
    groupVworld: GroupComparison;
    mostSimilarName: string;
    numberSameAnswer: number;
    groupMostSimilarNames: string;
    groupNumberSameAnswer: number;
}

export const initialFunFactstState: FunFactsState = {
    fetchSimilarStatus: 'unsent',
    bucketList: {
        textForGuess: '',
        globalTrue: 0,
        groupTrue: 0
    },
    groupVworld: {
        textForGuess: '',
        globalTrue: 0,
        groupTrue: 0
    },
    mostSimilarName: '',
    numberSameAnswer: 0,
    groupMostSimilarNames: "",
    groupNumberSameAnswer: 0
};

export const funFactsSlice = createSlice({
    name: "funFactsSlice",
    initialState: initialFunFactstState,
    reducers: {
        clearFunFacts: () => {
            return initialFunFactstState;
        },
        setFunFacts: (state, action: PayloadAction<payloads.FunFacts>) => {
            const { bucketList, groupVworld } = action.payload;
            state.bucketList = bucketList;
            state.groupVworld = groupVworld;
        },
        setMostSimilar: (state, action: PayloadAction<payloads.FetchMostSimilar>) => {
            const {
                name,
                numSameAnswer,
                groupMostSimilarNames,
                groupMostSimilarNumber
            } = action.payload;

            state.fetchSimilarStatus = 'success';
            state.numberSameAnswer = numSameAnswer;
            state.mostSimilarName = name;
            state.groupMostSimilarNames = groupMostSimilarNames;
            state.groupNumberSameAnswer = groupMostSimilarNumber;
        },
        setFetchSimilarStatus: (state, action: PayloadAction<FetchingStatus>) => {
            state.fetchSimilarStatus = action.payload;
        }
    },

    extraReducers: builder => {
        builder.addCase(clearGame, () => {
            return initialFunFactstState;
        })
    }
});

// actions
export const { clearFunFacts, setFunFacts, setMostSimilar, setFetchSimilarStatus } = funFactsSlice.actions;

// selectors
export const selectBucketList = (state: RootState) => state.funFacts.bucketList;
export const selectGroupVworld = (state: RootState) => state.funFacts.groupVworld;
export const selectMostSimilarPlayer = (state: RootState) => {
    return {
        name: state.funFacts.mostSimilarName,
        numSameAnwser: state.funFacts.numberSameAnswer,
    }
}

export const selectMostSimilarInGroup = (state: RootState) => {
    return {
        names: state.funFacts.groupMostSimilarNames,
        numSameAnwser: state.funFacts.groupNumberSameAnswer,
    }
}

export default funFactsSlice.reducer;
