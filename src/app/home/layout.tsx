import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import PersistLogin from "@/components/PersistLogin";

export const metadata: Metadata = {
  title: "HomePage",
  description: "This is the homepage",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PersistLogin>{children}</PersistLogin>
      </body>
    </html>
  );
}
