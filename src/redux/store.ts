import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./features/Auth";
import PeerActions from "./features/PeerActions";
export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    peer: PeerActions,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV == "production" ? false : true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
