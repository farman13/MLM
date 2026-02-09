import React from "react";

import {
    getDefaultConfig,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
    sepolia,
    bsc
} from "wagmi/chains";
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

const config = getDefaultConfig({
    appName: "My Project",
    projectId: "6dd15a3684137adf8eb5ed126f061236",
    chains: [sepolia, bsc],

    walletConnectOptions: {
        projectId: "6dd15a3684137adf8eb5ed126f061236",
        metadata: {
            name: "My Project",
            description: "Dapp",
            url: "",
            icons: [""]
        }
    },

    ssr: true,
});


export function RainbowKitRoot({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
