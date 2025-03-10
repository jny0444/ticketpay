import type { Metadata } from "next";
import "@/styles/globals.css";

import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";

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
      <body className="bg-neutral-950 selection:text-black selection:bg-neutral-100">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
