import { HStack, Flex } from "@chakra-ui/react";
import Action from "./Action";

function SelectAtion() {
   return (
      <div>
         <Flex
            justifyContent="center"
            alignItems="flex-start"
            minHeight="100vh"
            display="flex"
            mt={200}
         >
            <HStack spacing={10}>
               <Action title="Invest in a project" link="" />
               <Action title="Propose a project" link="/researcher" />
            </HStack>
         </Flex>
      </div>
   );
}

export default SelectAtion;
