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
      if (action.payload != null || action.payload != undefined) {
        state.selectedServer = action.payload;
      }
    },

    deleteSelectedServer: (state, action: PayloadAction<any>) => {
      state.servers = state.servers.filter(
        (server: any) => server.server._id != action.payload
      );
      if (state.selectedServer.server._id == action.payload) {
        state.selectedServer = null;
      }
    },
    addServers: (state, action: PayloadAction<any>) => {
      state.servers = action.payload;
    },
    updateServer: (state, action: PayloadAction<any>) => {
      state.servers = state.servers.map((server: any) => {
        if (server.server._id == action.payload._id) {
          server.server = action.payload;
        }
        return server;
      });
      console.log("ACITON", action.payload);
      state.selectedServer.server = action.payload;
    },
    deselectServer: (state) => {
      state.selectedServer = null;
    },
  },
});

export const {
  selectServer,
  deselectServer,
  addServers,
  updateServer,
  deleteSelectedServer,
} = auth.actions;
export default auth.reducer;
