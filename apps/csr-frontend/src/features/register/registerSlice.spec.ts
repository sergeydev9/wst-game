import registerReducer, { RegisterState } from "./registerSlice";

describe("registration slice", () => {
  const initialState: RegisterState = {
    status: "idle",
    errorMessage: "",
  };
  it("should have expected initial state", () => {
    expect(registerReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });
});
