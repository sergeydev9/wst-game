import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface OneLinersState {
  status: 'loading' | 'idle' | 'error';
  upcomingLines: string[];
}

const initialOneLinersState: OneLinersState = {
  status: 'idle',
  upcomingLines: [],
};

const oneLinersSlice = createSlice({
  name: 'oneLiners',
  initialState: initialOneLinersState,
  reducers: {
    clearOneLiners: () => initialOneLinersState,
    setUpcomingLines: (state, action: PayloadAction<string[]>) => {
      if (state.upcomingLines.length === 0) {
        state.upcomingLines = action.payload;
      }
    },
  },
});

// actions
export const { clearOneLiners, setUpcomingLines } = oneLinersSlice.actions;

// selectors
export const selectUpcomingLines = (state: RootState) =>
  state.oneLiners.upcomingLines;
export const selectOneLinersStatus = (state: RootState) =>
  state.oneLiners.status;

// reducer
export default oneLinersSlice.reducer;
