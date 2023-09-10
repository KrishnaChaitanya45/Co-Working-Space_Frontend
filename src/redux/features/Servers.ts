import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  selectedServer: null,
  servers: [],
} as any;
export const auth = createSlice({
  name: "server",
  initialState,
  reducers: {
    selectServer: (state, action: PayloadAction<any>) => {
      state.selectedServer = action.payload;
    },
    addServers: (state, action: PayloadAction<any>) => {
      state.servers = action.payload;
    },
    updateServer: (state, action: PayloadAction<any>) => {
      state.servers = state.servers.map((server: any) => {
        if (server.id == action.payload.id) {
          return action.payload;
        }
        return server;
      });
    },
    deselectServer: (state) => {
      state.selectedServer = null;
    },
  },
});

export const { selectServer, deselectServer, addServers, updateServer } =
  auth.actions;
export default auth.reducer;
