import React, { useEffect } from "react";
import Subscribe from "./Subscribe";
import { useResearcher } from "@/hooks/useResearcher";
import { useAccount } from "wagmi";
import { Text, Box } from "@chakra-ui/react";
import ResearcherBoard from "./ResearcherBoard";

function Researcher() {
   const { address } = useAccount();
   const { fetchResearcherInfo, researcherInfo } = useResearcher();

   useEffect(() => {
      fetchResearcherInfo(address);
   }, [address]);

   console.log(researcherInfo);

   return (
      <Box textAlign="center" p="2rem">
         {researcherInfo && researcherInfo.exist ? (
            researcherInfo.isValidated ? (
               <ResearcherBoard />
            ) : (
               <Text fontSize="1.2rem">
                  Your registration has been taken into account. It will be
                  validated as soon as possible.
               </Text>
            )
         ) : (
            <Subscribe />
         )}
      </Box>
   );
}

export default Researcher;
