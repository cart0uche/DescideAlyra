import { useState, useEffect } from "react";
import {
   Flex,
   Box,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
   TableContainer,
   useToast,
} from "@chakra-ui/react";

import { publicClient } from "../client";
import { parseAbiItem } from "viem";
import OneResearcher from "./OneResearcher";
import { v4 as uuidv4 } from "uuid";

function ResearchList() {
   const [researchers, setResearchers] = useState([]);

   async function fetchResearcher(setter) {
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

   useEffect(() => {
      fetchResearcher();
   }, []);

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
                        {researchers.map((researcher) => (
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
