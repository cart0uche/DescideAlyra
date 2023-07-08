import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Flex, Text, Spacer } from "@chakra-ui/react";
import Link from "next/link";

const Header = () => {
   return (
      <Flex p="2rem" justifyContent="flex-start" alignItems="center">
         <Link href="/">
            <Text
               fontSize="1.5rem"
               fontWeight="bold"
               color="blue.500"
               cursor="pointer"
            >
               Home
            </Text>
         </Link>
         <Text
            fontSize="1.5rem"
            fontWeight="bold"
            color="blue.500"
            cursor="pointer"
            ml={10}
         >
            Litepaper
         </Text>
         <Link href="/researcher">
            <Text
               fontSize="1.5rem"
               fontWeight="bold"
               color="blue.500"
               cursor="pointer"
               ml={10}
            >
               Researcher
            </Text>
         </Link>
         <Text
            fontSize="1.5rem"
            fontWeight="bold"
            color="blue.500"
            cursor="pointer"
            ml={10}
         >
            Project
         </Text>
         <Link href="/admin">
            <Text
               fontSize="1.5rem"
               fontWeight="bold"
               color="blue.500"
               cursor="pointer"
               ml={10}
            >
               Admin
            </Text>
         </Link>

         <Flex marginLeft="auto">
            <ConnectButton />
         </Flex>
      </Flex>
   );
};

export default Header;
