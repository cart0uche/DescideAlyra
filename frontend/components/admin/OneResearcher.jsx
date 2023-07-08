import { Button, Tr, Td } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
import { useResearcher } from "@/hooks/useResearcher";
import { useEffect } from "react";

function OneResearcher({ researcher }) {
   const {
      fetchResearcherInfo,
      changeResearcherStatus,
      isLoadingChangeResearcherStatus,
      researcherInfo,
   } = useResearcher();

   useEffect(() => {
      fetchResearcherInfo(researcher);
   }, []);
   

   const getResearcherInfo = () => {
      if (researcherInfo !== undefined && researcherInfo.isValidated) {
         return <CheckIcon />;
      } else {
         return (
            <Button
               isLoading={isLoadingChangeResearcherStatus}
               onClick={() => {
                  changeResearcherStatus({ args: [researcher.address, true] });
               }}
            >
               Valid
            </Button>
         );
      }
   };

   return (
      <Tr key={uuidv4()}>
         <Td>{researcher.address}</Td>
         <Td>{researcher.lastname}</Td>
         <Td>{researcher.forname}</Td>
         <Td>{researcher.company}</Td>
         <Td>{getResearcherInfo()}</Td>
      </Tr>
   );
}

export default OneResearcher;
