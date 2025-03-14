import { createConfig, http } from "wagmi";
import { hardhat } from "wagmi/chains";
import { metaMask, injected } from "wagmi/connectors";

export const config = createConfig({
    chains: [hardhat],
    connectors: [metaMask(), injected()],
    transports: {
        [hardhat.id] : http('http://localhost:8545')
    },
    ssr: true,
})