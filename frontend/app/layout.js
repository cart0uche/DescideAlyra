"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider } from "@chakra-ui/react";
import { FundsContextProvider } from "@/context/fundsContext";

const { chains, publicClient } = configureChains(
   [hardhat, sepolia],
   [
      alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
      publicProvider(),
   ]
);

const { connectors } = getDefaultWallets({
   appName: "My RainbowKit App",
   projectId: "16a564d23b8f56d75f0fe9f57bf7fd6e",
   chains,
});

const wagmiConfig = createConfig({
   autoConnect: true,
   connectors,
   publicClient,
});

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <body>
            <WagmiConfig config={wagmiConfig}>
               <RainbowKitProvider chains={chains}>
                  <ChakraProvider>
                     <FundsContextProvider>{children}</FundsContextProvider>
                  </ChakraProvider>
               </RainbowKitProvider>
            </WagmiConfig>
         </body>
      </html>
   );
}
