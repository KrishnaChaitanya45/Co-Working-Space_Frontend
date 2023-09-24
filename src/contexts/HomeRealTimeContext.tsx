"use client";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const WS = "http://localhost:5000/realtime-updates";
export const HomeContext = createContext<null | any>(null);
const socket = new (io as any)(WS, {
  transports: ["websocket"],
});
export function HomeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeContext.Provider value={{ socket }}>
      <div>{children}</div>
    </HomeContext.Provider>
  );
}
