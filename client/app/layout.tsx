import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Provider";

export const metadata: Metadata = {
  title: "TicketPay",
  description: "Resell your tickets with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
