"use client";
import React, { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Flex, Text, Spacer } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { useProject } from "@/hooks/useProject";

const Header = () => {
   const { isOwner, fetchOwner } = useProject();

   useEffect(() => {
      fetchOwner();
   }, []);

   return (
      <Flex
         p="2rem"
         justifyContent="space-between"
         alignItems="center"
         width="100%"
         h="15vh"
      >
         <Image src="/alyra.png" width={100} height={100} alt="alyra" />
         <Flex gap={3} ml={10}>
            <Link href="/">
               <Text
                  fontSize="1.5rem"
                  fontWeight="bold"
                  color="blue.500"
                  cursor="pointer"
               >
                  DeScide
               </Text>
            </Link>
            <Link href="/DescideLitepaper.pdf">
               <Text
                  fontSize="1.5rem"
                  fontWeight="bold"
                  color="blue.500"
                  cursor="pointer"
                  ml={10}
               >
                  Litepaper
               </Text>
            </Link>
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
            <Link href="/investor">
               <Text
                  fontSize="1.5rem"
                  fontWeight="bold"
                  color="blue.500"
                  cursor="pointer"
                  ml={10}
               >
                  Discover
               </Text>
            </Link>
            <Link href="/investor/myInvestissements">
               <Text
                  fontSize="1.5rem"
                  fontWeight="bold"
                  color="blue.500"
                  cursor="pointer"
                  ml={10}
               >
                  Investor
               </Text>
            </Link>
            {isOwner ? (
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
            ) : null}
         </Flex>

         <Flex marginLeft="auto">
            <ConnectButton />
         </Flex>
      </Flex>
   );
};

export default Header;
