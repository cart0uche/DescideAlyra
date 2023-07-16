import { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import Contract from "@/public/FundsFactory.json";
import { useToast } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";

export function useFundRequest() {
   const { isConnected, address: addressAccount } = useAccount();
   const toast = useToast();

   // Create project
   const { write: openFundsRequest, isLoadingOpenFundsRequest } =
      useContractWrite({
         address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
         abi: Contract.abi,
         functionName: "openFundsRequest",
         onError: (error) => {
            console.log(error);
            toast({
               status: "error",
               isClosable: true,
               position: "top-middle",
               title: "createFundsRequest failed",
               description: error.message,
            });
         },
         onSuccess: (data) => {
            toast({
               status: "info",
               isClosable: true,
               position: "top-middle",
               title: "Projet crée",
            });
         },
      });

   return {
      openFundsRequest,
      isLoadingOpenFundsRequest,
   };
}
