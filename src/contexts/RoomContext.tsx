"use client";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
const WS = "http://localhost:5000";
import Peer from "../utils/peer";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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
  const { peer } = useAppSelector((state) => state.peer);
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
    socket.on("room-created", (roomId: string) => {
      navigate.push(`/test/${roomId}`);
    });
  }, [socket]);
  useEffect(() => {
    if (!currentPeer) return;
    if (!stream) return;
    socket.on("user-joined", async ({ peer }: { peer: string }) => {
      const offer = await currentPeer.createOffer();
      socket.emit("offer", { offer, peer });
    });
    currentPeer.on("call", (call: any) => {
      console.log("CALL RECIEVED");
      call.answer(stream);
      call.on("stream", (userVideoStream: any) => {
        console.log("USER VIDEO STREAM", userVideoStream);
        dispatch(addPeer({ stream: userVideoStream, peerId: peer }));
      });
    });
  }, [currentPeer, stream]);
  return (
    <RoomContext.Provider
      value={{ socket, currentPeer, setCurrentPeer, stream }}
    >
      {currentPeer && <div>{children}</div>}
    </RoomContext.Provider>
  );
}
