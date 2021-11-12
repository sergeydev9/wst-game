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

export const fetchLines = createAsyncThunk(
    'oneLiners/fetchLines',
    async () => {
        const response = await api.get<GetOneLiners>('/one-liners');
        return response.data;
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
export const selectIsUpcomingEmpty = (state: RootState) => state.oneLiners.upcomingLines.length === 0;
export const selectOneLinersStatus = (state: RootState) => state.oneLiners.status;

// reducer
export default oneLinersSlice.reducer;