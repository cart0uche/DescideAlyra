import { useNFT } from "@/hooks/useNFT";
import { SimpleGrid, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Mint from "./Mint";

function Mints({ projectInfoContext }) {
   const {
      fetchNFTPrices,
      NFTPrices,
      fetchNFTNbMinted,
      NFTQuantityMinted,
      buyNFT_Classic,
      buyNFT_Plus,
      buyNFT_Premium,
      buyNFT_VIP,
   } = useNFT();
   const [NFTs, setNFTs] = useState([
      {
         type: "Classic",
         price: 0,
         quantitySold: 0,
         quantity: 40,
         mintFct: buyNFT_Classic,
      },
      {
         type: "Plus",
         price: 0,
         quantitySold: 0,
         quantity: 30,
         mintFct: buyNFT_Plus,
      },
      {
         type: "Premium",
         price: 0,
         quantitySold: 0,
         quantity: 4,
         mintFct: buyNFT_Premium,
      },
      {
         type: "VIP",
         price: 0,
         quantitySold: 0,
         quantity: 1,
         mintFct: buyNFT_VIP,
      },
   ]);

   console.log("projectInfoContext.fundNFT ", projectInfoContext.fundNFT);

   useEffect(() => {
      console.log("Mints : projectInfoContext.id ", projectInfoContext.id);
      fetchNFTPrices(projectInfoContext.id);
      fetchNFTNbMinted(projectInfoContext.id);
   }, []);

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
   }, [NFTQuantityMinted]);

   return (
      <Box mt={8}>
         <SimpleGrid columns={4} spacing={8} justifyContent="center">
            {NFTs.map((nft) => (
               <Mint
                  key={nft.type}
                  type={nft.type}
                  price={nft.price / 100}
                  quantitySold={nft.quantitySold}
                  quantity={nft.quantity}
                  mintFct={nft.mintFct}
                  projectID={projectInfoContext.id}
               />
            ))}
         </SimpleGrid>
      </Box>
   );
}

export default Mints;
