"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { RoomContextProvider } from "@/contexts/RoomContext";

const PersistLogin = dynamic(() => import("@/components/PersistLogin"), {
  ssr: false,
});
// const RoomContextProvider = dynamic(() => import("@/contexts/RoomContext"), {
//   ssr: false,
// });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dom, setDom] = useState(false);
  useEffect(() => {
    setDom(true);
  }, []);
  console.log(dom);
  return (
    <html lang="en">
      <body className={inter.className}>
        {dom ? (
          <>
            {/* @ts-ignore */}

            <div>{children}</div>
          </>
        ) : (
          <div> Loading </div>
        )}
      </body>
    </html>
  );
}
