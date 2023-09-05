"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
  title: "HomePage",
  description: "This is the homepage",
};
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
        {dom ? <PersistLogin>{children}</PersistLogin> : <div> Loading </div>}
      </body>
    </html>
  );
}
