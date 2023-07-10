import { useState, useEffect } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { publicClient } from "../conf/client";
import { parseAbiItem } from "viem";
import Contract from "@/public/FundsFactory.json";
import { useToast } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";

export function useNFT() {
  const { address: addressAccount } = useAccount();
  const [NFTPrices, setNFTPrices] = useState();

  // get NFTs prices
  const fetchNFTPrices = async (id) => {
    console.log("->fetchNFTPrices ", id);
    const data = await readContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
      functionName: "getNFT_Prices",
      args: [Number(id)],
      onError(error) {
        console.log("fetchNFTPrices FAILED");
        console.log("Error", error);
      },
      onSuccess(data) {
        console.log("fetchNFTPrices SUCCESS");
      },
      account: addressAccount,
    });
    console.log("<-fetchNFTPrices ");
    setNFTPrices(data);
  };

  return {
    fetchNFTPrices,
    NFTPrices,
  };
}
