import { useNFT } from "@/hooks/useNFT";
import React, { useEffect } from "react";

function Mint({ projectInfoContext }) {
  const { fetchNFTPrices, NFTPrices } = useNFT();

  console.log("projectInfoContext.fundNFT ", projectInfoContext.fundNFT);

  useEffect(() => {
    fetchNFTPrices(projectInfoContext.id);
  }, []);

  useEffect(() => {
    fetchNFTPrices("projectInfoContext.id", projectInfoContext.id);
    console.log("NFTPrices ", NFTPrices);
  }, [NFTPrices]);

  return <div>Mint</div>;
}

export default Mint;
