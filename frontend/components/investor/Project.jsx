import { useFundsContext } from "@/context/fundsContext";
import { Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import { FaEthereum, FaClock, FaCheckCircle } from "react-icons/fa";
import Mints from "./Mints";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import ProjectStatus from "../utils/ProjectStatus";

function Project() {
   const { projectInfoContext } = useFundsContext();
   const router = useRouter();
   const { address } = useAccount();

   const getStatusProject = (status) => {
      switch (status) {
         case 0:
            return "Waiting for validation";
         case 1:
            return "Available for funding";
         case 2:
            return "Ready for funding";
         case 3:
            return "Ended";
         default:
            return "";
      }
   };

   if (projectInfoContext === null) {
      router.push("/");
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
      <Flex direction="column" p={8} alignItems="center">
         <Box
            borderWidth="1px"
            borderRadius="md"
            p={8}
            boxShadow="md"
            bg="white"
            width="100%"
            maxWidth="1000px"
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
                     src={"https://ipfs.io/ipfs/" + projectInfoContext.imageUrl}
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
                        Goal:
                     </Text>

                     <Text fontSize="xl">
                        {Number(projectInfoContext.amountAsked)} ETH
                     </Text>
                  </Flex>

                  <Flex alignItems="center" mb={4}>
                     <FaClock size={24} color="gray.500" />
                     <Text fontSize="xl" fontWeight="bold" ml={2}>
                        Status:
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
                  {isMineProject(projectInfoContext.researcher) ? (
                     <>CLOSE</>
                  ) : null}
               </Flex>
            </Flex>

            <Text fontSize="xl" mb={8} maxWidth="100%">
               {projectInfoContext.description}
            </Text>

            <ProjectStatus projectInfoContext={projectInfoContext} />

            <Flex alignItems="center" mb={4}>
               <Mints projectInfoContext={projectInfoContext} />
            </Flex>
         </Box>
      </Flex>
   );
}

export default Project;
