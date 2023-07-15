"use client";
import React from "react";
import { useState, useEffect } from "react";
import SelectAction from "./SelectAction";

function Main() {
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) return <></>;

   return (
      <div>
         <SelectAction/>
      </div>
   );
}

export default Main;
