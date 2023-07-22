"use client";
import { useFundsContext } from "@/context/fundsContext";
import {
   Flex,
   Box,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   TableContainer,
   Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Vote from "./Vote";
import { fetchVotes } from "@/components/fetchData";

function Votes() {
   const { projectInfoContext } = useFundsContext();
   const [votes, setVotes] = useState([]);

   useEffect(() => {
    if (projectInfoContext !== null) {
       console.log("Votes projectInfoContext", projectInfoContext);
       fetchVotes(setVotes, projectInfoContext.id);
    }
   }, [projectInfoContext]);

   useEffect(() => {
      console.log("votes ", votes);
   }, [votes]);

   // return a table with all the votes from a project
   return (
      <div>
         <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
            Vote details
         </Text>
         <Flex justifyContent="center">
            <Box m={4} borderWidth="1px" color="#3182CE" borderColor="#3182CE">
               <TableContainer>
                  <Table variant="simple" size="lg">
                     <Thead>
                        <Tr key={uuidv4()}>
                           <Th textAlign="center">Request id</Th>
                           <Th textAlign="center">Researcher address</Th>
                           <Th textAlign="center">Vote</Th>
                        </Tr>
                     </Thead>

                     <Tbody>
                        {votes &&
                           votes.map((vote) => (
                              <Vote key={uuidv4()} voteInfo={vote} />
                           ))}
                     </Tbody>
                  </Table>
               </TableContainer>
            </Box>
         </Flex>
      </div>
   );
}

export default Votes;
