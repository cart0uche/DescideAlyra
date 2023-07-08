import React from "react";
import Subscribe from "./researcher/Subscribe";
import SelectAction from "./SelectAction";
import { useContractRead, useAccount } from "wagmi";

function Main() {
   const { address: addrAccount, isConnected } = useAccount();

   if (!isConnected) {
      return <div></div>;
   }

   return (
      <div>
         <SelectAction />
      </div>
   );
}

export default Main;
