"use client";
import React from "react";
import { useState, useEffect } from "react";
import SelectAction from "./SelectAction";
import { useAccount } from "wagmi";

function Main() {
   const { address: addrAccount, isConnected } = useAccount();
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!isConnected) {
      return <div></div>;
   }

   if (!mounted) return <></>;

   return (
      <div>
         <SelectAction />
      </div>
   );
}

export default Main;
