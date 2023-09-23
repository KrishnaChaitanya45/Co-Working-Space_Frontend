"use client";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
const WS = "https://co-working-space-backend.onrender.com/calls-and-chats";
import Peer from "../utils/peer";
import { useRouter } from "next/navigation";
import { useAppDispatch, AppSelector } from "@/redux/hooks";
import { addPeer } from "@/redux/features/PeerActions";
export const RoomContext = createContext<null | any>(null);
const socket = new (io as any)(WS, {
  transports: ["websocket"],
});
export function RoomContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useRouter();
  const dispatch = useAppDispatch();
  const { peer } = AppSelector((state) => state.peer);
  const [currentPeer, setCurrentPeer] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream>();
  useEffect(() => {
    const ourId = uuid();
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.log(error);
    }
    setCurrentPeer(peer);
    // console.log("PEER", peer);
  }, [socket]);

  return (
    <RoomContext.Provider
      value={{ socket, currentPeer, setCurrentPeer, stream }}
    >
      {currentPeer && <div>{children}</div>}
    </RoomContext.Provider>
  );
}
