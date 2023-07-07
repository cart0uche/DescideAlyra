import { Tr, Td, Button, useToast } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
import { useContractWrite, useContractRead, useAccount } from "wagmi";
import Contract from "@/public/FundsFactory.json";

function OneResearcher({ researcher }) {
   const toast = useToast();
   const { address: addrAccount } = useAccount();

   const { write, isLoading } = useContractWrite({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
      functionName: "changeResearcherStatus",
      args: [researcher.address, true],
      onError(error) {
         console.log(error);
         onClose();
         toast({
            status: "error",
            isClosable: true,
            position: "top-middle",
            title: "L'inscription a échoué",
            description: error.message,
         });
      },
      onSuccess(data) {
         toast({
            status: "info",
            isClosable: true,
            position: "top-middle",
            title: "Reasercher has been validated",
         });
      },
   });

   const getResearcherInfo = () => {
      if (dataResearcher !== undefined && dataResearcher.isValidated) {
         return <CheckIcon />;
      } else {
         return (
            <Button isLoading={isLoading} onClick={write}>
               Valid
            </Button>
         );
      }
   };

   const { data: dataResearcher, error } = useContractRead({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
      functionName: "getResearcher",
      onError(error) {
         console.log("Error", error);
      },
      args: [researcher.address],
      account: addrAccount,
   });

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
