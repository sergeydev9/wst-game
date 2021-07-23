import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// local imports
import { history } from "../../app/hooks";
import { ROUTES } from "../../util/constants";
import { RootState } from "../../app/store";
import register from "./registerAPI";

export interface RegisterState {
  status: "idle" | "loading" | "failed";
  errorMessage: string;
}

export interface RegisterResponse {
  message: "created";
}

export interface RegisterProps {
  email: string;
  password: string;
}

const initialState: RegisterState = {
  status: "idle",
  errorMessage: "",
};

export const registerThunk = createAsyncThunk(
  "register/register",
  async ({ email, password }: RegisterProps, { rejectWithValue }) => {
    try {
      return await register(email, password);
    } catch (e) {
      // TODO: Look over this logic. May want to display different messages for server error or authentication failure.
      rejectWithValue(e.message || "An unknown error has occured");
    }
  }
);

export const authSlice = createSlice({
  name: "register",
  initialState,
  reducers: {}, // need reducers even if empty
  extraReducers: (builder) => {
    // pending
    builder.addCase(registerThunk.pending, (state: RegisterState) => {
      state.status = "loading";
      state.errorMessage = "";
    });
    //fail
    builder.addCase(
      registerThunk.rejected,
      (state: RegisterState, { payload }) => {
        state.status = "failed";
        state.errorMessage = payload as string;
      }
    );
    // success
    builder.addCase(registerThunk.fulfilled, (state: RegisterState) => {
      state.status = "idle";
      state.errorMessage = "";

      // nav to login after registration
      history.push(ROUTES.login);

      // TODO: Add registration successs flash message.
    });
  },
});

export const selectToken = (state: RootState) => state.auth.token;
export const selectStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
