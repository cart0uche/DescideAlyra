import { Button, Tr, Td } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { useFundRequest } from "@/hooks/useFundRequest";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

function OneFundsRequest({ fundsRequest }) {
   const { getFundsRequestDetails, fundsRequestDetail } = useFundRequest();
   console.log("fundsRequest", fundsRequest);

   useEffect(() => {
      getFundsRequestDetails(fundsRequest.fundsRequestId);
   }, []);

   useEffect(() => {
      console.log("fundsRequestDetail", fundsRequestDetail);
   }, [fundsRequestDetail]);

   const getDate = (sec) => {
      const date = new Date(1000 * Number(sec));
      const ret = date.toLocaleDateString("fr-FR");
      return ret;
   };

   const getStatus = (status) => {
      switch (status) {
         case 0:
            return "In progress";
         case 1:
            return "Ended";
         default:
            return "Unkown" + status;
      }
   };

   return (
      <Tr key={uuidv4()}>
         <Td>{fundsRequestDetail && getDate(fundsRequestDetail[3])}</Td>
         <Td>
            {fundsRequestDetail && getStatus(Number(fundsRequestDetail[5]))}
         </Td>
         <Td>{fundsRequestDetail && fundsRequestDetail[2]}</Td>
         <Td>
            {fundsRequestDetail &&
               ethers.utils.formatEther(fundsRequestDetail[1])}{" "}
            ETH
         </Td>
         <Td>
            <Button>Vote</Button>
         </Td>
      </Tr>
   );
}

export default OneFundsRequest;
