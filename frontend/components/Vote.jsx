"use client";
import { Tr, Td } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

function Vote({ voteInfo }) {
   return (
      <Tr key={uuidv4()}>
         <Td>{Number(voteInfo.fundsRequestId)}</Td>
         <Td>{voteInfo.voter}</Td>

         <Td>{voteInfo.voted ? "YES" : "NO"}</Td>
      </Tr>
   );
}

export default Vote;
