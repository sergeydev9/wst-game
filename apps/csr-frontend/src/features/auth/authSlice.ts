import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// local imports
import { history } from "../../app/hooks";
import { ROUTES } from "../../util/constants";
import { RootState } from "../../app/store";
import login, { LoginResponse } from "./authAPI";

export interface AuthState {
  status: "loggedOut" | "loggedIn" | "loading" | "failed";
  token: string;
  userId: string;
  email: string;
  errorMessage: string;
}

export interface logInProps {
  email: string;
  password: string;
}

export const initialState: AuthState = {
  status: "loggedOut",
  token: "",
  userId: "",
  errorMessage: "",
  email: "",
};

export const logInThunk = createAsyncThunk<LoginResponse, logInProps, { rejectValue: string }>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await login(email, password);
      return (await response.json()) as LoginResponse;
    } catch (e) {
      // TODO: Look over this logic. May want to display different messages for server error or authentication failure.
      return rejectWithValue("login failed");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // pending
    builder.addCase(logInThunk.pending, (state: AuthState) => {
      state.status = "loading";
    });

    //fail
    builder.addCase(logInThunk.rejected, (state: AuthState, action) => {
      state.status = "failed";
      state.errorMessage = action.payload as string;
      state.token = "";
      state.userId = "";
    });
    // success
    builder.addCase(logInThunk.fulfilled, (state: AuthState, { payload }) => {
      if (!payload) throw new Error("no payload received");
      state.status = "loggedIn";
      state.errorMessage = "";
      state.email = payload.user.email;
      state.userId = payload.user.id;
      state.token = payload.token;

      // nav to home on login success
      history.push(ROUTES.home);
    });
  },
});

export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
