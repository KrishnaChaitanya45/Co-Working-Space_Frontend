"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Poppins } from "next/font/google";
import Channel from "./components/Channels";
import ChannelPage from "./components/ChatPages/TextChannelPage";
import AudioChannelPage from "./components/ChatPages/AudioChannel";
import { AppSelector } from "@/redux/hooks";
const Servers = dynamic(() => import("./components/Servers"), {
  ssr: false,
});
const poppins = Poppins({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});
const WS = "https://co-working-space-backend.onrender.com";
const page = () => {
  const selectedTextChannel = AppSelector(
    (state) => state.server.selectedTextChannel
  );
  const selectedAudioChannel = AppSelector(
    (state) => state.server.selectedTextChannel
  );
  useEffect(() => {}, []);
  return (
    <div
      className={`bg-[#37393F] justify-between w-[100vw] h-[100vh] overflow-hidden flex relative ${poppins.className}`}
    >
      {" "}
      <Servers />
      <Channel />
      {selectedTextChannel && <ChannelPage />}
      {!selectedTextChannel && <AudioChannelPage />}
      <Navbar />
    </div>
  );
};

export default page;
