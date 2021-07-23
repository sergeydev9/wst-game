import authReducer, { AuthState } from "./authSlice";

describe("auth reducer", () => {
  const initialState: AuthState = {
    status: "loggedOut",
    token: "",
    userId: "",
    errorMessage: "",
    email: "",
  };

  it("should have expected initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });
});
