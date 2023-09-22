"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { RoomContextProvider } from "@/contexts/RoomContext";
import {
  HomeContext,
  HomeContextProvider,
} from "@/contexts/HomeRealTimeContext";

const PersistLogin = dynamic(() => import("@/components/PersistLogin"), {
  ssr: false,
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dom, setDom] = useState(false);
  useEffect(() => {
    setDom(true);
  }, []);
  return (
    <html lang="en">
      <body className={inter.className}>
        {dom ? (
          <PersistLogin>
            <RoomContextProvider>
              <HomeContextProvider>{children}</HomeContextProvider>
            </RoomContextProvider>
          </PersistLogin>
        ) : (
          <div> Loading </div>
        )}
      </body>
    </html>
  );
}
