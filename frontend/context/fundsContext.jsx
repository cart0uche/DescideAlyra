"use client";
import { createContext, useState, useContext } from "react";
import { useToast } from "@chakra-ui/react";

const FundsContext = createContext({});

export const FundsContextProvider = ({ children }) => {
   const [projectInfoContext, setProjectInfoContext] = useState(null);

   const toast = useToast();

   return (
      <FundsContext.Provider
         value={{
            projectInfoContext,
            setProjectInfoContext,
         }}
      >
         {children}
      </FundsContext.Provider>
   );
};

export const useFundsContext = () => useContext(FundsContext);
