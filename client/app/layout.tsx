import type { Metadata } from "next";
import "@/styles/globals.css";

import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TicketPay",
  description: "Resell ticket platform on chain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="selection:text-black selection:bg-neutral-100">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
