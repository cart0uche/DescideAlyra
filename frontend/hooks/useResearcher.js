import { useState, useEffect } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { publicClient } from "../conf/client";
import { parseAbiItem } from "viem";
import Contract from "@/public/FundsFactory.json";
import { useToast } from "@chakra-ui/react";
import { readContract } from "@wagmi/core";

export function useResearcher() {
   const { isConnected, address: addressAccount } = useAccount();
   const [isResearcher, setIsResearcher] = useState(null);
   const [researchers, setResearchers] = useState([]);
   const [projects, setProjects] = useState([]);
   const [researcherInfo, setResearcherInfo] = useState();
   const [projectInfo, setProjectInfo] = useState();
   const toast = useToast();

   // Get all researcher
   async function fetchResearcher() {
      const filter = await publicClient.createEventFilter({
         address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
         event: parseAbiItem(
            "event ResearcherAdded(address, string, string, string)"
         ),
         fromBlock: 0n,
      });

      const logs = await publicClient.getFilterLogs({ filter });

      const parsedResearchers = logs.map((log, index) => {
         const address = log.args[0];
         const lastname = log.args[1];
         const forname = log.args[2];
         const company = log.args[3];
         return {
            address,
            lastname,
            forname,
            company,
         };
      });
      setResearchers(parsedResearchers);
   }

   // Get all projects
   async function fetchProject() {
      const filter = await publicClient.createEventFilter({
         address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
         event: parseAbiItem("event ResearchProjectCreated(uint256, address)"),
         fromBlock: 0n,
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

   // Change status of one researcher
   const {
      write: changeResearcherStatus,
      isLoading: isLoadingChangeResearcherStatus,
   } = useContractWrite({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
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

   const fetchResearcherInfo = async (address) => {
      const data = await readContract({
         address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
         abi: Contract.abi,
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

   const { write: subscribe, isLoadingSubscribe } = useContractWrite({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
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

   useEffect(() => {
      fetchResearcher();
      fetchProject();
   }, [isConnected, addressAccount]);

   return {
      researchers,
      changeResearcherStatus,
      isLoadingChangeResearcherStatus,
      fetchResearcherInfo,
      researcherInfo,
      subscribe,
      isLoadingSubscribe,
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
