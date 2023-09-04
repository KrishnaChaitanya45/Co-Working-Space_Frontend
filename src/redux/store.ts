import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./features/Auth";
export const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
  devTools: process.env.NODE_ENV ? process.env.NODE_ENV !== "production" : true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
