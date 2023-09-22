"use client";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const WS = "https://co-working-space-backend.onrender.com/realtime-updates";
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
