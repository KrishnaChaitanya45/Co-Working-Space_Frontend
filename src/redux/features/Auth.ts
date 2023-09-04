import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  auth: { user: any; accessToken: string };
};

const initialState = {
  auth: {
    user: null,
    accessToken: "",
  },
} as AuthState;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: any; accessToken: string }>
    ) => {
      state.auth = action.payload;
    },
  },
});

export const { setAuth } = auth.actions;
export default auth.reducer;
