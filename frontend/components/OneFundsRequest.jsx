import { Button, Tr, Td } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { useFundRequest } from "@/hooks/useFundRequest";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
   ButtonGroup,
   useToast,
   Popover,
   PopoverTrigger,
   PopoverContent,
   PopoverHeader,
   PopoverBody,
   PopoverFooter,
   PopoverArrow,
   PopoverCloseButton,
   useDisclosure,
} from "@chakra-ui/react";
import { MdOutlineHowToVote } from "react-icons/md";

function OneFundsRequest({ fundsRequest }) {
   const { isOpen, onToggle, onClose } = useDisclosure();
   const { getFundsRequestDetails, fundsRequestDetail } = useFundRequest();
   const { addVote, isLoadingAddVote } = useFundRequest();

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
            <Popover
               returnFocusOnClose={false}
               isOpen={isOpen}
               onClose={onClose}
               placement="right"
               closeOnBlur={false}
            >
               <PopoverTrigger>
                  <Button
                     leftIcon={<MdOutlineHowToVote size={20} />}
                     type="submit"
                     variant="solid"
                     colorScheme="blue"
                     onClick={onToggle}
                     isLoading={isLoadingAddVote}
                  >
                     Vote
                  </Button>
               </PopoverTrigger>

               <PopoverContent>
                  <PopoverHeader fontWeight="semibold">
                     Confirmation
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                     Do you vote in favor of this request?
                  </PopoverBody>
                  <PopoverFooter display="flex" justifyContent="flex-end">
                     <ButtonGroup size="sm">
                        <Button
                           variant="outline"
                           onClick={() => {
                              addVote({
                                 args: [fundsRequest.fundsRequestId, false],
                              });
                              onClose();
                           }}
                        >
                           No
                        </Button>
                        <Button
                           colorScheme="red"
                           onClick={() => {
                              addVote({
                                 args: [fundsRequest.fundsRequestId, true],
                              });
                              onClose();
                           }}
                        >
                           Yes
                        </Button>
                     </ButtonGroup>
                  </PopoverFooter>
               </PopoverContent>
            </Popover>
         </Td>
      </Tr>
   );
}

export default OneFundsRequest;
