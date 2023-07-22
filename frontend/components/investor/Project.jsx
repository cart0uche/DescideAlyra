"use client";
import { useFundsContext } from "@/context/fundsContext";
import {
   Box,
   Flex,
   Heading,
   Image,
   Link,
   Text,
   Progress,
} from "@chakra-ui/react";
import { FaEthereum, FaClock } from "react-icons/fa";
import Mints from "./Mints";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import ProjectStatus from "../utils/ProjectStatus";
import { ethers } from "ethers";
import ChangeProjectStatus from "../researcher/ChangeProjectStatus";
import FundsRequestList from "../FundsRequestList";
import FundRequestCreation from "../FundRequestCreation";
import { useEffect } from "react";
import SeeVoteDetails from "../SeeVoteDetails";

function Project() {
   const { projectInfoContext } = useFundsContext();
   const router = useRouter();
   const { address } = useAccount();

   console.log("Project projectInfoContext ", projectInfoContext);

   const getStatusProject = (status) => {
      switch (status) {
         case 0:
            return "Waiting for validation";
         case 1:
            return "NFT Sale Open";
         case 2:
            return "Fund request open";
         case 3:
            return "Ended";
         default:
            return "";
      }
   };

   useEffect(() => {
      if (projectInfoContext === null) {
         router.push("/investor");
      }
   }, []);

   if (projectInfoContext === null) {
      return <div />;
   }

   const isMineProject = () => {
      if (projectInfoContext.researcher === address) {
         return true;
      } else {
         return false;
      }
   };

   return (
      <>
         <Flex direction="column" p={8} alignItems="center">
            <Box
               borderWidth="1px"
               borderRadius="md"
               p={8}
               boxShadow="md"
               bg="white"
               width="100%"
               maxWidth="1100px"
            >
               <Flex direction="column" alignItems="center" mb={6}>
                  <Heading size="2xl" textAlign="center">
                     {projectInfoContext.title}
                  </Heading>
                  <Text fontSize="lg" mt={2} color="gray.500">
                     by {projectInfoContext.researcher}
                  </Text>
               </Flex>

               <Flex
                  direction={{ base: "column", md: "row" }}
                  alignItems="center"
                  justifyContent="space-between"
                  mb={8}
               >
                  <Box
                     position="relative"
                     width={{ base: "100%", md: "50%" }}
                     height="auto"
                     mb={{ base: 4, md: 0 }}
                  >
                     <Image
                        src={
                           "https://ipfs.io/ipfs/" + projectInfoContext.imageUrl
                        }
                        layout="responsive"
                        objectFit="cover"
                        alt="Project Image"
                     />
                  </Box>

                  <Flex
                     direction="column"
                     alignItems={{ base: "flex-start", md: "flex-end" }}
                     ml={{ base: 0, md: 6 }}
                     mt={{ base: 4, md: 0 }}
                     textAlign={{ base: "left", md: "right" }}
                  >
                     <Flex alignItems="center" mb={4}>
                        <FaEthereum size={24} color="gray.500" />
                        <Text fontSize="xl" fontWeight="bold" ml={2}>
                           Goal:{" "}
                        </Text>

                        <Text fontSize="xl">
                           {Number(projectInfoContext.amountAsked)} ETH
                        </Text>
                     </Flex>

                     <Flex alignItems="center" mb={1}>
                        <FaEthereum size={24} color="gray.500" />
                        <Text fontSize="xl" fontWeight="bold" ml={2}>
                           Funded:{" "}
                        </Text>

                        <Text fontSize="xl">
                           {ethers.utils.formatEther(
                              projectInfoContext.amountReceived
                           )}
                           ETH
                        </Text>
                     </Flex>
                     <Box
                        position="relative"
                        width={{ base: "100%", md: "50%" }}
                        height="auto"
                        mb={{ base: 4, md: 0 }}
                     >
                        <Progress
                           hasStripe
                           value={
                              (100 *
                                 Number(
                                    ethers.utils.formatEther(
                                       projectInfoContext.amountReceived
                                    )
                                 )) /
                              Number(projectInfoContext.amountAsked)
                           }
                        />
                     </Box>

                     <Flex alignItems="center" mb={4}>
                        <FaClock size={24} color="gray.500" />
                        <Text fontSize="xl" fontWeight="bold" ml={2}>
                           Status:{" "}
                        </Text>
                        <Text fontSize="xl" color="blue.500">
                           {getStatusProject(projectInfoContext.status)}
                        </Text>
                     </Flex>

                     <Link
                        href={
                           "https://ipfs.io/ipfs/" +
                           projectInfoContext.projectDetailsUri
                        }
                     >
                        <Text
                           fontSize="xl"
                           color="blue.500"
                           fontWeight="bold"
                           _hover={{ textDecoration: "underline" }}
                        >
                           View Litepaper
                        </Text>
                     </Link>
                  </Flex>
               </Flex>

               <Text fontSize="xl" mb={8} maxWidth="100%">
                  {projectInfoContext.description}
               </Text>

               <ProjectStatus projectInfoContext={projectInfoContext} />

               {isMineProject(projectInfoContext.researcher) ? (
                  <ChangeProjectStatus
                     projectInfoContext={projectInfoContext}
                  />
               ) : null}

               {projectInfoContext.status == 1 ? (
                  <Flex alignItems="center" mb={4}>
                     <Mints projectInfoContext={projectInfoContext} />
                  </Flex>
               ) : null}

               {isMineProject(projectInfoContext.researcher) &&
               projectInfoContext.status == 2 ? (
                  <Flex alignItems="center" mb={4} direction="column" mt={10}>
                     <FundRequestCreation
                        projectInfoContext={projectInfoContext}
                     />
                  </Flex>
               ) : null}

               {projectInfoContext.status == 2 ? (
                  <Flex alignItems="center" mb={4} direction="column" mt={5}>
                     <FundsRequestList
                        projectInfoContext={projectInfoContext}
                     />
                  </Flex>
               ) : null}
               <Flex alignItems="center" mb={4} direction="column" mt={10}>
                  <SeeVoteDetails />
               </Flex>
            </Box>
         </Flex>
      </>
   );
}

export default Project;
