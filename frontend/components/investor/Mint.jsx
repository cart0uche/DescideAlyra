import { Card, Button, Progress, Box, Text } from "@chakra-ui/react";
import {
   CardHeader,
   CardBody,
   CardFooter,
   Heading,
   Divider,
} from "@chakra-ui/react";
import React from "react";
import { ethers } from "ethers";
import { useNFT } from "@/hooks/useNFT";

function Mint({ type, price, quantitySold, quantity, typeNFT, projectID }) {
   const {   
      buyNFT,
   } = useNFT();
   const progress = (quantitySold / quantity) * 100;
   const remaining = quantity - quantitySold;

   return (
      <div>
         <Card>
            <CardHeader>
               <Heading size="l">
                  NFT {type} {quantitySold}/{quantity}
               </Heading>
            </CardHeader>

            <CardBody>
               <Text fontWeight="bold">{remaining} remaining</Text>
               <Text fontWeight="bold">Price: {Number(price)} ETH</Text>
            </CardBody>

            <CardFooter>
               <Progress
                  value={progress}
                  size="sm"
                  colorScheme="blue"
                  mb={4}
                  borderRadius="md"
               />
               <Divider />
               <Button
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  mt={4}
                  onClick={() =>
                     buyNFT({
                        value: ethers.utils.parseEther(price.toString()),
                        args: [projectID, typeNFT],
                     })
                  }
                  isDisabled={remaining === 0}
               >
                  Mint NFT
               </Button>
            </CardFooter>
         </Card>
      </div>
   );
}

export default Mint;
