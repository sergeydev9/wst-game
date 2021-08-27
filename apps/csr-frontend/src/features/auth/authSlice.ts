import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { api } from '../../api';

export interface AuthState {
  loggedIn: boolean;
  token: string;
  id: number;
  email: string;
  roles: string[];
  deckCredits: number;
  authError: string;
  fetchDetailsError: string;
  updateError: string;
}

export interface UserDetailsUpdate {
  email: string;
}

export interface logInProps {
  email: string;
  password: string;
}

export interface LoginActionPayload {
  token: string,
  id: number,
  email: string,
  roles: string[]
}

export const initialState: AuthState = {
  loggedIn: false,
  roles: [],
  token: '',
  id: 0,
  deckCredits: 0,
  email: '',
  authError: '',
  fetchDetailsError: '',
  updateError: ''
};

export const setErrorThunk = createAsyncThunk("auth/setErrorThunk",
  async (errorMessage: string, thunkAPI) => {
    // display error
    thunkAPI.dispatch(setError(errorMessage))

    //clear error after 5 seconds
    setTimeout(() => thunkAPI.dispatch(clearError()), 2000)

  }
)

// TODO: use details endpoint to retrieve notifications when that feature gets added.
export const fetchDetails = createAsyncThunk('auth/fetchDetails',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get('/user/details')
      return response.data
    } catch (e) {
      //clear error after 5 seconds
      setTimeout(() => dispatch(clearError()), 2000)
      return rejectWithValue(e.response.data)
    }
  }
)

export const updateAccount = createAsyncThunk<UserDetailsUpdate, { email: string }>('auth/updateAccount',
  async ({ email }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch('/user/update', { email })
      return response.data
    } catch (e) {
      //clear error after 5 seconds
      setTimeout(() => dispatch(clearError()), 2000)
      return rejectWithValue(e.response.data)
    }
  }
)

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      return initialState;
    },
    login: (state, action: PayloadAction<LoginActionPayload>) => {
      const { token, email, id, roles } = action.payload
      state.token = token;
      state.email = email;
      state.id = id;
      state.roles = roles;
      state.loggedIn = true
    },
    setError: (state, action) => {
      state.authError = action.payload
    },
    clearError: (state) => {
      state.authError = '';
      state.fetchDetailsError = '';
      state.updateError = ''
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchDetails.fulfilled, (state, action) => {
      state.deckCredits = action.payload.question_deck_credits;
    })
    builder.addCase(fetchDetails.rejected, (state, action) => {
      state.deckCredits = 0;
      if (typeof action.payload === 'string') {
        state.updateError = action.payload

      } else {
        state.updateError = 'An unexpected error has occured while retrieving account details. Please try again later.'
      }
    })

    builder.addCase(updateAccount.fulfilled, (state, action) => {
      state.email = action.payload.email
    })
    builder.addCase(updateAccount.rejected, (state, action) => {
      if (typeof action.payload === 'string') {
        state.updateError = action.payload

      } else {
        state.updateError = 'An unexpected error has occured while updating account. Please try again later.'
      }
    })
  }
});

export const { login, logout, setError, clearError } = authSlice.actions;




export const selectAuthToken = (state: RootState) => state.auth.token;
export const isLoggedIn = (state: RootState) => state.auth.loggedIn;
export const selectDeckCredits = (state: RootState) => state.auth.deckCredits;
export const selectEmail = (state: RootState) => state.auth.email;
export const selectAuthError = (state: RootState) => state.auth.authError;
export const selectDetailsError = (state: RootState) => state.auth.fetchDetailsError;
export const selectUpdateError = (state: RootState) => state.auth.updateError;

export default authSlice.reducer;
