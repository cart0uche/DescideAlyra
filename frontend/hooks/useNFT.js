import { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import Contract from "@/public/FundsFactory.json";
import { readContract } from "@wagmi/core";

export function useNFT() {
   const { address: addressAccount } = useAccount();
   const [NFTPrices, setNFTPrices] = useState([]);
   const [NFTQuantityMinted, setNFTQuantityMinted] = useState([]);

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

   // get NFTS quantity minted
   const fetchNFTNbMinted = async (id) => {
      console.log("->fetchNFTNbMinted ", id);
      const data = await readContract({
         address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
         abi: Contract.abi,
         functionName: "getNumberNFTMinted",
         args: [Number(id)],
         onError(error) {
            console.log("fetchNFTNbMinted FAILED");
            console.log("Error", error);
         },
         onSuccess(data) {
            console.log("fetchNFTNbMinted SUCCESS");
         },
         account: addressAccount,
      });
      console.log("<-fetchNFTNbMinted ");
      setNFTQuantityMinted(data);
   };

   const { write: buyNFT } = useContractWrite({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
      functionName: "buyNFT",
      onError(error) {
         console.log("buyNFT FAILED");
         console.log("Error", error);
      },
      onSuccess(data) {
         console.log("buyNFT SUCCESS");
      },
      account: addressAccount,
   });

   return {
      fetchNFTPrices,
      NFTPrices,
      fetchNFTNbMinted,
      NFTQuantityMinted,
      buyNFT,
   };
}
