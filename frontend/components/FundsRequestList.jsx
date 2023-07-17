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
import { useEffect, useState } from "react";
import { fetchFundsRequests } from "@/components/fetchData";
import { v4 as uuidv4 } from "uuid";
import OneFundsRequest from "./OneFundsRequest";
import { useFundsContext } from "@/context/fundsContext";

function FundsRequestList({ projectInfoContext }) {
   const { newFundsRequest } = useFundsContext();
   const [fundsRequests, setFundsRequests] = useState([]);

   useEffect(() => {
      fetchFundsRequests(setFundsRequests);
   }, [newFundsRequest]);

   return (
      <div>
         <Flex justifyContent="center">
            <Box m={4} borderWidth="1px" color="#3182CE" borderColor="#3182CE">
               <TableContainer>
                  <Table variant="simple" size="lg">
                     <Thead>
                        <Tr key={uuidv4()}>
                           <Th textAlign="center">Creation date</Th>
                           <Th textAlign="center">Status</Th>
                           <Th textAlign="center">Description</Th>
                           <Th textAlign="center">Amount asked</Th>
                           <Th textAlign="center">Vote</Th>
                        </Tr>
                     </Thead>

                     <Tbody>
                        {fundsRequests &&
                           fundsRequests.map((fundsRequest) => (
                              <OneFundsRequest
                                 key={uuidv4()}
                                 fundsRequest={fundsRequest}
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

export default FundsRequestList;
