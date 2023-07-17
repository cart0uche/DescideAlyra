import { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import Contract from "@/public/FundsFactory.json";
import { useToast } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";

export function useFundRequest() {
   const { isConnected, address: addressAccount } = useAccount();
   const [fundsRequestDetail, setFundsRequestDetail] = useState();
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
               title: "openFundsRequest failed",
               description: error.message,
            });
         },
         onSuccess: (data) => {
            toast({
               status: "info",
               isClosable: true,
               position: "top-middle",
               title: "openFundsRequest success",
            });
         },
      });

   const { write: createFundsRequest, isLoadingCreateFundsRequest } =
      useContractWrite({
         address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
         abi: Contract.abi,
         functionName: "createFundsRequest",
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
               title: "createFundsRequest success",
            });
         },
      });

   const getFundsRequestDetails = async (fundRequestId) => {
      const data = await readContract({
         address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
         abi: Contract.abi,
         functionName: "getFundsRequestDetails",
         onError(error) {
            console.log("Error", error);
         },
         onSuccess(data) {},
         args: [Number(fundRequestId)],
         account: addressAccount,
      });
      setFundsRequestDetail(data);
   };

   // créer une fonction pour voter
   const { write: addVote, isLoadingAddVote } = useContractWrite({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
      functionName: "addVote",
      onError: (error) => {
         console.log(error);
         toast({
            status: "error",
            isClosable: true,
            position: "top-middle",
            title: "addVote failed",
            description: error.message,
         });
      },
      onSuccess: (data) => {
         toast({
            status: "info",
            isClosable: true,
            position: "top-middle",
            title: "addVote success",
         });
      },
   });

   return {
      openFundsRequest,
      isLoadingOpenFundsRequest,
      createFundsRequest,
      isLoadingCreateFundsRequest,
      getFundsRequestDetails,
      fundsRequestDetail,
      addVote,
      isLoadingAddVote,
   };
}
