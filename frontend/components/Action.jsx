import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

function Action({ title, link }) {
   return (
      <Box
         w="500px"
         h="500px"
         cursor="pointer"
         position="relative"
         borderWidth="2px"
         borderRadius="md"
      >
         <Link href={link}>
            <Flex
               justifyContent="center"
               alignItems="center"
               h="100%"
               position="absolute"
               top="0"
               left="0"
               right="0"
               bottom="0"
            >
               <Text
                  fontSize="clamp(16px, 10vw, 40px)"
                  color="black"
                  textAlign="center"
               >
                  {title}
               </Text>
            </Flex>
         </Link>
      </Box>
   );
}

export default Action;
