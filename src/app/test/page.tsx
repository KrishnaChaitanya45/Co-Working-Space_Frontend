"use client";
import { RoomContext } from "@/contexts/RoomContext";
import React from "react";

const page = () => {
  const { socket } = React.useContext(RoomContext);
  const joinRoom = () => {
    socket.emit("create-room");
  };
  return (
    <div className="w-[100vw] h-[100vh] bg-black flex justify-center items-center">
      <button
        className="text-white bg-theme_purple p-4 rounded-lg"
        onClick={joinRoom}
      >
        Start new meeting
      </button>
    </div>
  );
};
export default page;
