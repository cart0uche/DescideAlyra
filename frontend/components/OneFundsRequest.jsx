import { Button, Tr, Td, Flex } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { useFundRequest } from "@/hooks/useFundRequest";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
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
   Text,
} from "@chakra-ui/react";
import { MdOutlineHowToVote } from "react-icons/md";
import { useFundsContext } from "@/context/fundsContext";

function OneFundsRequest({ fundsRequest }) {
   const { isOpen, onToggle, onClose } = useDisclosure();
   const { projectInfoContext } = useFundsContext();
   const { address } = useAccount();
   const {
      getFundsRequestDetails,
      fundsRequestDetail,
      addVote,
      isLoadingAddVote,
      voteResult,
      getVoteResult,
      closeFundsRequest,
      isLoadingCloseFundsRequest,
      claimFunds,
      isLoadingClaimFunds,
   } = useFundRequest();

   useEffect(() => {
      getFundsRequestDetails(fundsRequest.fundsRequestId);
      getVoteResult(fundsRequest.fundsRequestId);
   }, []);

   useEffect(() => {
      console.log("fundsRequestDetail", fundsRequestDetail);
   }, [fundsRequestDetail]);

   const isMineProject = () => {
      if (projectInfoContext && projectInfoContext.researcher === address) {
         return true;
      } else {
         return false;
      }
   };

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
            return "Closed";
         case 2:
            return "Claimed";
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
            <Flex direction="column">
               {voteResult ? (
                  <>
                     <Text>
                        Votes : {Number(voteResult.voted)} /{" "}
                        {Number(voteResult.totalVoters)}
                     </Text>
                     <Text color="green">
                        Yes : {Number(voteResult.yes)} (weight:{" "}
                        {Number(voteResult.yesWeight)})
                     </Text>
                     <Text color="red">
                        No : {Number(voteResult.no)} (weight:{" "}
                        {Number(voteResult.noWeight)})
                     </Text>

                     {fundsRequestDetail &&
                     getStatus(Number(fundsRequestDetail[5])) === "Closed" ? (
                        <>
                           {voteResult.isAccepted ? (
                              <Text fontSize="xl" color="green">
                                 Accepted
                              </Text>
                           ) : (
                              <Text fontSize="xl" color="red">
                                 Rejected
                              </Text>
                           )}
                        </>
                     ) : null}
                  </>
               ) : (
                  <Text> Loading ...</Text>
               )}

               {fundsRequestDetail &&
               getStatus(Number(fundsRequestDetail[5])) === "In progress" ? (
                  <>
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
                           <PopoverFooter
                              display="flex"
                              justifyContent="flex-end"
                           >
                              <ButtonGroup size="sm">
                                 <Button
                                    variant="outline"
                                    onClick={() => {
                                       addVote({
                                          args: [
                                             fundsRequest.fundsRequestId,
                                             false,
                                          ],
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
                                          args: [
                                             fundsRequest.fundsRequestId,
                                             true,
                                          ],
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

                     {isMineProject(projectInfoContext.researcher) ? (
                        <Button
                           margin={3}
                           isLoading={isLoadingCloseFundsRequest}
                           onClick={() =>
                              closeFundsRequest({
                                 args: [fundsRequest.fundsRequestId],
                              })
                           }
                        >
                           Close the request
                        </Button>
                     ) : null}
                  </>
               ) : (
                  <>
                     {isMineProject(projectInfoContext.researcher) &&
                     voteResult &&
                     voteResult.isAccepted ? (
                        <Button
                           margin={3}
                           isLoading={isLoadingClaimFunds}
                           onClick={() =>
                              claimFunds({
                                 args: [fundsRequest.fundsRequestId],
                              })
                           }
                        >
                           Claim
                        </Button>
                     ) : null}
                  </>
               )}
            </Flex>
         </Td>
      </Tr>
   );
}

export default OneFundsRequest;
