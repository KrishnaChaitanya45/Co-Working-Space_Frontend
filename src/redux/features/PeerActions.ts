import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PeerState = {
  peer: {
    peerId: string;
    stream?: MediaStream;
  };
};

const initialState = {
  peer: {},
} as PeerState;

export const PeerActions = createSlice({
  name: "peer",
  initialState,
  reducers: {
    addPeer: (
      state,
      action: PayloadAction<{ peerId: string; stream: MediaStream }>
    ) => {
      //@ts-ignore
      console.log("addPeer", action.payload);
      state.peer[action.payload.peerId] = {
        stream: action.payload.stream,
      };
    },
    removePeer: (state, action: PayloadAction<{ peerId: string }>) => {
      //@ts-ignore
      const { [action.payload.peerId]: _, ...rest } = state.peer;
      //@ts-ignore
      state.peer = rest;
    },
  },
});

export const { addPeer, removePeer } = PeerActions.actions;
export default PeerActions.reducer;
