import React from "react";

import {
    RainbowKitProvider,
    connectorsForWallets,
} from "@rainbow-me/rainbowkit";

import {
    metaMaskWallet,
    trustWallet,
    tokenPocketWallet,
    walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { createConfig, WagmiProvider } from "wagmi";
import { sepolia, bsc } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const projectId = "6dd15a3684137adf8eb5ed126f061236";

// ✅ Define ONLY required wallets
const connectors = connectorsForWallets(
    [
        {
            groupName: "Recommended",
            wallets: [
                metaMaskWallet,
                trustWallet,
                tokenPocketWallet,
                walletConnectWallet,
            ],
        },
    ],
    {
        appName: "My Project",
        projectId,
    }
);

// ✅ Create wagmi config manually
const config = createConfig({
    connectors,
    chains: [sepolia, bsc],
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