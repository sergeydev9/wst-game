import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetOneLiners } from "@whosaidtrue/api-interfaces";
import { api } from '../../api';
import { RootState } from "../../app/store";


interface OneLinersState {
    status: 'loading' | 'idle' | 'error';
    currentLine: string;
    upcomingLines: string[];
}


const initialOneLinersState: OneLinersState = {
    status: 'idle',
    currentLine: '',
    upcomingLines: []
}

export const fetchLines = createAsyncThunk<GetOneLiners, void, { state: RootState }>(
    'oneLiners/fetchLines',
    async () => {
        const response = await api.get<GetOneLiners>('/one-liners');
        return response.data;
    },
    {   // if a request is already pending, don't send another
        condition: (_, { getState }) => {
            const { oneLiners } = getState();
            if (oneLiners.upcomingLines.length === 0 && oneLiners.status === "idle") return true;
            return false;
        }
    }
)

const oneLinersSlice = createSlice({
    name: 'oneLiners',
    initialState: initialOneLinersState,
    reducers: {
        clearOneLiners: () => initialOneLinersState,
        nextLine: (state) => {
            const { upcomingLines } = state;
            const line = upcomingLines.pop();

            if (line) {
                state.currentLine = line;
                state.upcomingLines = upcomingLines;
            } else {
                state.currentLine = '';
                state.upcomingLines = [];
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchLines.fulfilled, (state, action) => {
            state.status = 'idle';
            const { oneLiners } = action.payload;
            const line = oneLiners.pop();

            if (line) {
                state.currentLine = line.text;
            }

            const nextLines = oneLiners.map(oneLiner => oneLiner.text);
            state.upcomingLines = nextLines;
        })

        builder.addCase(fetchLines.rejected, (state) => {
            state.status = 'error';
        })

        builder.addCase(fetchLines.pending, (state) => {
            state.status = 'loading';
        })
    }

})

// actions
export const { clearOneLiners, nextLine } = oneLinersSlice.actions;

// selectors
export const selectCurrentLine = (state: RootState) => state.oneLiners.currentLine;
export const selectOneLinersStatus = (state: RootState) => state.oneLiners.status;

// reducer
export default oneLinersSlice.reducer;