"use client";

import { config } from "@/config/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { VerificationProvider } from "@/context/VerificationContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <VerificationProvider>{children}</VerificationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
