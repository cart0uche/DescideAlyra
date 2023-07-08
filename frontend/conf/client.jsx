import { createPublicClient, http } from "viem";
import { localhost, sepolia } from "viem/chains";

export const publicClient = createPublicClient({
   chain: localhost,
   //chain: sepolia,
   transport: http(),
});
