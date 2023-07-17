"use client";
import { createContext, useState, useContext } from "react";
import { useContractEvent } from "wagmi";
import { useToast } from "@chakra-ui/react";
import Contract from "@/public/FundsFactory.json";

const FundsContext = createContext({});

export const FundsContextProvider = ({ children }) => {
   const [newFundsRequest, setNewFundsRequest] = useState(0);
   const [projectInfoContext, setProjectInfoContext] = useState(null);

   const toast = useToast();

   const unwatchFundsRequestCreated = useContractEvent({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
      eventName: "FundsRequestCreated",
      listener: (event) => {
         console.log("FundsRequestCreated");
         setNewFundsRequest(event[0].args.requestId);
         unwatchFundsRequestCreated();
      },
   });

   return (
      <FundsContext.Provider
         value={{
            projectInfoContext,
            setProjectInfoContext,
            newFundsRequest,
         }}
      >
         {children}
      </FundsContext.Provider>
   );
};

export const useFundsContext = () => useContext(FundsContext);
