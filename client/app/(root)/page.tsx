import { WagmiProvider } from "wagmi";
import { config } from "@/config/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <div></div>
    </WagmiProvider>
  );
}
