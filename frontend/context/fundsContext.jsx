"use client";
import { createContext, useState, useContext } from "react";
import { useContractEvent } from "wagmi";
import { useToast } from "@chakra-ui/react";
import Contract from "@/public/FundsFactory.json";

const FundsContext = createContext({});

export const FundsContextProvider = ({ children }) => {
   const [newFundsRequest, setNewFundsRequest] = useState(0);
   const [projectInfoContext, setProjectInfoContext] = useState(null);
   const [newVoteAddedForRequestId, setNewVoteAdded] = useState(null);
   const [updateViewNFT, setUpdateViewNFT] = useState(0);

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

   const unwatchVoteAdded = useContractEvent({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
      eventName: "VoteAdded",
      listener: (event) => {
         console.log("VoteAdded");
         setNewVoteAdded(event[0].args.requestId);
         unwatchVoteAdded();
      },
   });

   const unwatchNFTbought = useContractEvent({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
      eventName: "NFTbought",
      listener: (event) => {
         console.log("NFTbought ", event[0].args.timestamp);
         setUpdateViewNFT(Number(event[0].args.timestamp));
         unwatchNFTbought();
      },
   });

   return (
      <FundsContext.Provider
         value={{
            projectInfoContext,
            setProjectInfoContext,
            newFundsRequest,
            newVoteAddedForRequestId,
            updateViewNFT,
         }}
      >
         {children}
      </FundsContext.Provider>
   );
};

export const useFundsContext = () => useContext(FundsContext);
