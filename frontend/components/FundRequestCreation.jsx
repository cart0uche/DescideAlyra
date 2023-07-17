import {
   Drawer,
   DrawerBody,
   DrawerFooter,
   DrawerHeader,
   DrawerOverlay,
   DrawerContent,
   DrawerCloseButton,
   useDisclosure,
   Button,
   Stack,
   Box,
   FormLabel,
   Input,
   Textarea,
} from "@chakra-ui/react";
import { useRef } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { useFundRequest } from "@/hooks/useFundRequest";
import { ethers } from "ethers";
import { FaEthereum, FaClock } from "react-icons/fa";

function FundRequestCreation({ projectInfoContext }) {
   const { createFundsRequest, isLoadingCreateFundsRequest } = useFundRequest();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const firstField = useRef();

   const handleSubmit = (e) => {
      e.preventDefault();
      console.log("projectInfoContext.id ", projectInfoContext.id);
      createFundsRequest({
         args: [
            projectInfoContext.id,
            ethers.utils.parseEther(amount.value),
            description.value,
         ],
      });
      onClose();
   };

   return (
      <div>
         <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            onClick={onOpen}
            isLoading={isLoadingCreateFundsRequest}
         >
            Create funds request
         </Button>
         <Drawer
            isOpen={isOpen}
            placement="right"
            initialFocusRef={firstField}
            onClose={onClose}
         >
            <DrawerOverlay />
            <DrawerContent>
               <DrawerCloseButton />
               <DrawerHeader borderBottomWidth="1px">
                  Create a Fund Request
               </DrawerHeader>

               <DrawerBody>
                  <Stack spacing="24px">
                     <Box>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Textarea ref={firstField} id="description" />
                     </Box>

                     <Box>
                        <FormLabel htmlFor="amount">Name</FormLabel>
                        <Input id="amount" placeholder="Amount needed" />
                     </Box>
                  </Stack>
               </DrawerBody>

               <DrawerFooter borderTopWidth="1px">
                  <Button variant="outline" mr={3} onClick={onClose}>
                     Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleSubmit}>
                     Submit
                  </Button>
               </DrawerFooter>
            </DrawerContent>
         </Drawer>
      </div>
   );
}

export default FundRequestCreation;
