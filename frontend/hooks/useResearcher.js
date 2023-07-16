import { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import Contract from "@/public/FundsFactory.json";
import ContractResearcher from "@/public/ResearcherRegistry.json";
import { useToast } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";

export function useResearcher() {
   const [researcherInfo, setResearcherInfo] = useState();
   const { isConnected, address: addressAccount } = useAccount();
   const toast = useToast();

   // Change status of one researcher
   const {
      write: changeResearcherStatus,
      isLoading: isLoadingChangeResearcherStatus,
   } = useContractWrite({
      address: process.env.NEXT_PUBLIC_CONTRACT_RESEARCHER_ADDRESS,
      abi: ContractResearcher.abi,
      functionName: "changeResearcherStatus",
      account: addressAccount,
      onError(error) {
         console.log(error);
         toast({
            status: "error",
            isClosable: true,
            position: "top-middle",
            title: "L'inscription a échoué",
            description: error.message,
         });
      },
      onSuccess(data) {
         toast({
            status: "info",
            isClosable: true,
            position: "top-middle",
            title: "Reasercher has been validated",
         });
      },
   });

   const fetchResearcherInfo = async (address) => {
      const data = await readContract({
         address: process.env.NEXT_PUBLIC_CONTRACT_RESEARCHER_ADDRESS,
         abi: ContractResearcher.abi,
         functionName: "getResearcher",
         onError(error) {
            console.log("Error", error);
         },
         onSuccess(data) {},
         args: [address],
         account: addressAccount,
      });
      setResearcherInfo(data);
   };

   const { write: subscribe, isLoadingSubscribe } = useContractWrite({
      address: process.env.NEXT_PUBLIC_CONTRACT_RESEARCHER_ADDRESS,
      abi: ContractResearcher.abi,
      functionName: "addResearcher",
      onError: (error) => {
         console.log(error);
         toast({
            status: "error",
            isClosable: true,
            position: "top-middle",
            title: "L'inscription a échoué",
            description: error.message,
         });
      },
      onSuccess: (data) => {
         toast({
            status: "info",
            isClosable: true,
            position: "top-middle",
            title: "Inscription réalisée",
         });
      },
   });

   return {
      changeResearcherStatus,
      isLoadingChangeResearcherStatus,
      fetchResearcherInfo,
      researcherInfo,
      subscribe,
      isLoadingSubscribe,
   };
}
