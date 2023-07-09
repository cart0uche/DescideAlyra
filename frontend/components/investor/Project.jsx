import { useFundsContext } from "@/context/fundsContext";
import { Flex, Divider, Heading, Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

function Project() {
   const { projectInfoContext } = useFundsContext();

   console.log("projectInfoContext", projectInfoContext);

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
      }
   };

   function convertEpochToDate(epoch) {
      const date = new Date(epoch * 1000); // Multiply by 1000 as JavaScript works with milliseconds
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
   }

   return (
      <Flex direction="column" alignItems="center" p={8}>
         <Heading size="xl" textAlign="center" my={4}>
            {projectInfoContext.title}
         </Heading>
         <Box position="relative" width="500px" height="500px" my={4}>
            <Image
               src={projectInfoContext.imageUrl}
               layout="fill"
               objectFit="contain"
               alt="image"
            />
         </Box>
         <Text fontSize="xl" mt={4}>
            Created the{" "}
            {convertEpochToDate(Number(projectInfoContext.creationTime))} by{" "}
            {projectInfoContext.researcher}
         </Text>

         <Text fontSize="xl" mt={4}>
            Status Project : {getStatusProject(projectInfoContext.status)}
         </Text>

         <Text fontSize="xl" mt={4}>
            Goal : {Number(projectInfoContext.amountAsked)} ETH
         </Text>
         <Text fontSize="xl" mt={4}>
            {projectInfoContext.description}
         </Text>
         <Link href={projectInfoContext.projectDetailsUri}>
            <Text fontSize="xl" mt={4}>
               Link to the litepaper
            </Text>
         </Link>
      </Flex>
   );
}

export default Project;
