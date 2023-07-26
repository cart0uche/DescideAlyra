import { createPublicClient, http } from "viem";
import { localhost, sepolia } from "viem/chains";

const chain =
   process.env.NEXT_PUBLIC_CLIENT_CHAIN === "sepolia" ? sepolia : localhost;

export const publicClient = createPublicClient({
   chain: chain,
   transport: http(
      "https://eth-sepolia.g.alchemy.com/v2/" +
         process.env.NEXT_PUBLIC_ALCHEMY_ID
   ),
});

export const getPublicClient = () => {
   return createPublicClient({
      chain: sepolia,
      transport: http(),
   });
};
