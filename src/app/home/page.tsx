"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Poppins } from "next/font/google";
import Channel from "./components/Channels";

const Servers = dynamic(() => import("./components/Servers"), {
  ssr: false,
});
const poppins = Poppins({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});
const page = () => {
  return (
    <div
      className={`bg-[#37393F] w-full h-[100vh] flex relative ${poppins.className}`}
    >
      {" "}
      <Servers />
      <Channel />
      <Navbar />
    </div>
  );
};

export default page;
