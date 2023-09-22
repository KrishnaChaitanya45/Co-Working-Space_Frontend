import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  selectedServer: null,
  selectedTextChannel: null,
  selectedAudioChannel: null,
  selectedVideoChannel: null,
  notifications: [],
  channels: {
    textChannels: [],
    audioChannels: [],
    videoChannels: [],
  },
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
    selectTextChannel: (state, action: PayloadAction<any>) => {
      if (action.payload != null || action.payload != undefined) {
        state.selectedTextChannel = action.payload;
        state.selectedAudioChannel = null;
        state.selectedVideoChannel = null;
      }
    },
    deselectTextChannel: (state: any) => {
      state.selectedTextChannel = null;
    },
    selectAudioChannel: (state, action: PayloadAction<any>) => {
      if (action.payload != null || action.payload != undefined) {
        state.selectedAudioChannel = action.payload;
        state.selectedTextChannel = null;
        state.selectedVideoChannel = null;
      }
    },
    deselectAudioChannel: (state: any) => {
      state.selectedAudioChannel = null;
    },
    deleteSelectedServer: (state, action: PayloadAction<any>) => {
      state.servers = state.servers.filter(
        (server: any) => server.server._id != action.payload
      );
      if (state.selectedServer.server._id == action.payload) {
        state.selectedServer = null;
      }
    },
    addChannels: (state, action: PayloadAction<any>) => {
      state.channels = action.payload;
    },
    addTextChannel: (state, action: PayloadAction<any>) => {
      state.channels.textChannels = action.payload;
    },
    addAudioChannel: (state, action: PayloadAction<any>) => {
      state.channels.audioChannels = action.payload;
    },
    updateTextChannels: (state, action: PayloadAction<any>) => {
      state.channels.textChannels = state.channels.textChannels.map(
        (channel: any) => {
          if (channel._id == action.payload._id) {
            channel = action.payload;
          }
          return channel;
        }
      );
      console.log("UPDATED CHANNELS ", action.payload);
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
    addNotification: (state, action: PayloadAction<any>) => {
      state.notifications.push(action.payload);
    },
  },
});

export const {
  selectServer,
  deselectServer,
  selectTextChannel,
  deselectTextChannel,
  selectAudioChannel,
  deselectAudioChannel,
  addChannels,
  updateTextChannels,
  addServers,
  addNotification,
  addTextChannel,
  updateServer,
  addAudioChannel,
  deleteSelectedServer,
} = auth.actions;
export default auth.reducer;
