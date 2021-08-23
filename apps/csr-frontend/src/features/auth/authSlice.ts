import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface AuthState {
  loggedIn: boolean;
  token: string;
  id: number;
  email: string;
  roles: string[];
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
  token: "",
  id: 0,
  email: "",
};

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
    }
  },

});

export const { login, logout } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.auth.token;
export const isLoggedIn = (state: RootState) => state.auth.loggedIn;

export default authSlice.reducer;
