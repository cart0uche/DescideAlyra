import { useState, useEffect } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { publicClient } from "../conf/client";
import { parseAbiItem } from "viem";
import Contract from "@/public/FundsFactory.json";
import { useToast } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";

export function useProject() {
   const { isConnected, address: addressAccount } = useAccount();
   const [projects, setProjects] = useState([]);
   const [projectInfo, setProjectInfo] = useState();
   const toast = useToast();

   // Get all projects
   async function fetchProject() {
      console.log("--------> fetchProject");
      const blockNumber = BigInt(
         Number(await publicClient.getBlockNumber()) - 15000
      );
      const filter = await publicClient.createEventFilter({
         address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
         event: parseAbiItem("event ResearchProjectCreated(uint256, address)"),
         fromBlock: blockNumber < 0 ? 0n : blockNumber,
      });

      const logs = await publicClient.getFilterLogs({ filter });

      const parsedProjects = logs.map((log, index) => {
         const projectId = log.args[0];
         const researcherAddress = log.args[1];
         return {
            projectId,
            researcherAddress,
         };
      });
      setProjects(parsedProjects);
   }

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

   useEffect(() => {
      fetchProject();
   }, [isConnected, addressAccount]);

   return {
      createProject,
      isLoadingCreateProject,
      projects,
      setProjects,
      fetchProjectInfo,
      projectInfo,
      validProject,
      isLoadingValidProject,
   };
}
