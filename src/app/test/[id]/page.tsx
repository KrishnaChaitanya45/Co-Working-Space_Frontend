"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { getNavigator } from "@/app/login/components/Modal";

const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

const Video = (props: any) => {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    props.peer.on("stream", (stream: any) => {
      //@ts-ignore
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} muted />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const Room = ({ params }: { params: { id: string } }) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef<any>();
  const userVideo = useRef<any>();
  const peersRef = useRef<any>([]);
  const roomID = params.id;

  useEffect(() => {
    socketRef.current = new (io as any)(
      "https://co-working-space-backend.onrender.com",
      {
        transports: ["websocket"],
      }
    );
    const navigator = getNavigator() as any;
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream: any) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", (users: any) => {
          const peers = [] as any;
          users.forEach((userID: any) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload: any) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          //@ts-ignore
          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload: any) => {
          const item = peersRef.current.find(
            (p: any) => p.peerID === payload.id
          );
          item.peer.signal(payload.signal);
        });
      });
  }, []);

  function createPeer(userToSignal: any, callerID: any, stream: any) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal: any, callerID: any, stream: any) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <Container>
      <StyledVideo ref={userVideo} autoPlay playsInline muted />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
    </Container>
  );
};

export default Room;
