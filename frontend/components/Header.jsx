"use client";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Flex, Text, Spacer } from "@chakra-ui/react";

const Header = () => {
   return (
      <Flex p="2rem" justifyContent="space-between" alignItems="right">
         <Spacer />
         <ConnectButton />
      </Flex>
   );
};

export default Header;
