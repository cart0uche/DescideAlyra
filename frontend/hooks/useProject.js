import { useState } from "react";
import { useAccount, useContractWrite } from "wagmi";
import Contract from "@/public/FundsFactory.json";
import { useToast } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";

export function useProject() {
   const { isConnected, address: addressAccount } = useAccount();
   const [projectInfo, setProjectInfo] = useState();
   const toast = useToast();

   // Get project details
   const fetchProjectInfo = async (id) => {
      console.log("->fetchProjectInfo ", id);
      const data = await readContract({
         address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
         abi: Contract.abi,
         functionName: "getResearchProject",
         onError(error) {
            console.log("fetchProjectInfo FAILED");
            console.log("Error", error);
         },
         onSuccess(data) {
            console.log("fetchProjectInfo SUCCESS");
         },
         args: [Number(id)],
         account: addressAccount,
      });
      setProjectInfo(data);
   };

   // Create project
   const { write: createProject, isLoadingCreateProject } = useContractWrite({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
      functionName: "addResearchProject",
      onError: (error) => {
         console.log(error);
         toast({
            status: "error",
            isClosable: true,
            position: "top-middle",
            title: "La creation du projet a échoué",
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

   // Change status of one researcher
   const { write: validProject, isLoading: isLoadingValidProject } =
      useContractWrite({
         address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
         abi: Contract.abi,
         functionName: "validResearchProject",
         account: addressAccount,
         onError(error) {
            console.log(error);
            toast({
               status: "error",
               isClosable: true,
               position: "top-middle",
               title: "La validation du projet a échoué",
               description: error.message,
            });
         },
         onSuccess(data) {
            toast({
               status: "info",
               isClosable: true,
               position: "top-middle",
               title: "Project has been validated",
            });
         },
      });

   return {
      createProject,
      isLoadingCreateProject,
      fetchProjectInfo,
      projectInfo,
      validProject,
      isLoadingValidProject,
   };
}
