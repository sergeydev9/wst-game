import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../app/hooks";
import { RootState } from "../../app/store";

export interface AuthState {
  loggedIn: boolean;
  token: string;
  id: number;
  email: string;
  roles: string[];
  authError: string;
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
  email: '',
  authError: ''
};

export const setErrorThunk = createAsyncThunk("auth/setErrorThunk",
  async (errorMessage: string, thunkAPI) => {
    // display error
    thunkAPI.dispatch(setError(errorMessage))

    //clear error after 5 seconds
    setTimeout(() => thunkAPI.dispatch(clearError()), 2000)

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
      state.authError = ''
    }

  },
});

export const { login, logout, setError, clearError } = authSlice.actions;




export const selectAuthToken = (state: RootState) => state.auth.token;
export const isLoggedIn = (state: RootState) => state.auth.loggedIn;
export const selectAuthError = (state: RootState) => state.auth.authError;

export default authSlice.reducer;
