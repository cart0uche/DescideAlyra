import {
   Flex,
   Box,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   TableContainer,
} from "@chakra-ui/react";

import OneResearcher from "./OneResearcher";
import { v4 as uuidv4 } from "uuid";
import { useResearcher } from "@/hooks/useResearcher";

function ResearchList() {
   const { researchers } = useResearcher();

   return (
      <div>
         <Flex justifyContent="center">
            <Box m={4} borderWidth="1px" color="#3182CE" borderColor="#3182CE">
               <TableContainer>
                  <Table variant="simple" size="lg">
                     <Thead>
                        <Tr key={uuidv4()}>
                           <Th textAlign="center">Address</Th>
                           <Th textAlign="center">Lastname</Th>
                           <Th textAlign="center">Forname</Th>
                           <Th textAlign="center">Company</Th>
                        </Tr>
                     </Thead>

                     <Tbody>
                        {researchers &&
                           researchers.map((researcher) => (
                              <OneResearcher
                                 key={uuidv4()}
                                 researcher={researcher}
                              />
                           ))}
                     </Tbody>
                  </Table>
               </TableContainer>
            </Box>
         </Flex>
      </div>
   );
}

export default ResearchList;
