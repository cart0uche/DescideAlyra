import React, { useEffect } from "react";
import Subscribe from "./Subscribe";
import { useResearcher } from "@/hooks/useResearcher";
import { useAccount } from "wagmi";
import { Text } from "@chakra-ui/react";

function Researcher() {
   const { address } = useAccount();
   const { fetchResearcherInfo, researcherInfo } = useResearcher();

   useEffect(() => {
      fetchResearcherInfo(address);
   }, [address]);

   console.log(researcherInfo);

   return (
      <>
         {researcherInfo && researcherInfo.exist ? (
            researcherInfo.isValidated ? (
               <Text>Content for validated researcher</Text>
            ) : (
               <Text>
                  Your registration has been taken into account, it will be
                  validated as soon as possible
               </Text>
            )
         ) : (
            <Subscribe />
         )}
      </>
   );
}

export default Researcher;
