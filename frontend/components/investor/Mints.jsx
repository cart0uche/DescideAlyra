import { useNFT } from "@/hooks/useNFT";
import { SimpleGrid, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useFundsContext } from "@/context/fundsContext";
import Mint from "./Mint";

function Mints({ projectInfoContext }) {
   const {
      fetchNFTPrices,
      NFTPrices,
      fetchNFTNbMinted,
      NFTQuantityMinted,
      buyNFT,
   } = useNFT();
   const [NFTs, setNFTs] = useState([
      {
         type: "Classic",
         price: 0,
         quantitySold: 0,
         quantity: 40,
         typeNFT: 0,
      },
      {
         type: "Plus",
         price: 0,
         quantitySold: 0,
         quantity: 10,
         typeNFT: 1,
      },
      {
         type: "Premium",
         price: 0,
         quantitySold: 0,
         quantity: 4,
         typeNFT: 2,
      },
      {
         type: "VIP",
         price: 0,
         quantitySold: 0,
         quantity: 1,
         typeNFT: 3,
      },
   ]);
   const { updateViewNFT } = useFundsContext();

   console.log("projectInfoContext.fundNFT ", projectInfoContext.fundNFT);

   useEffect(() => {
      fetchNFTPrices(projectInfoContext.id);
   }, []);

   useEffect(() => {
      fetchNFTNbMinted(projectInfoContext.id);
   }, [updateViewNFT]);

   useEffect(() => {
      console.log("NFTPrices ", NFTPrices);
      if (NFTPrices.length > 0) {
         setNFTs((_NFTs) => {
            return _NFTs.map((nft, index) => {
               nft.price = Number(NFTPrices[index]);
               return nft;
            });
         });
      }
   }, [NFTPrices]);

   useEffect(() => {
      console.log("NFTQuantityMinted ", NFTQuantityMinted);
      if (NFTQuantityMinted.length > 0) {
         setNFTs((_NFTs) => {
            return _NFTs.map((nft, index) => {
               nft.quantitySold = Number(NFTQuantityMinted[index]);
               return nft;
            });
         });
      }
   }, [NFTQuantityMinted, updateViewNFT]);

   return (
      <Box mt={8}>
         <SimpleGrid columns={4} spacing={8} justifyContent="center">
            {NFTs.map((nft) => (
               <Mint
                  key={nft.type}
                  type={nft.type}
                  price={nft.price / 1000}
                  quantitySold={nft.quantitySold}
                  quantity={nft.quantity}
                  typeNFT={nft.typeNFT}
                  projectID={projectInfoContext.id}
                  projectStatus={projectInfoContext.status}
               />
            ))}
         </SimpleGrid>
      </Box>
   );
}

export default Mints;
