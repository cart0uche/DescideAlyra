import { createPublicClient, http } from "viem";
import { localhost, sepolia } from "viem/chains";

const chain =
   process.env.NEXT_PUBLIC_CLIENT_CHAIN === "sepolia" ? sepolia : localhost;

export const publicClient = createPublicClient({
   chain: chain,
   transport: http(),
});
