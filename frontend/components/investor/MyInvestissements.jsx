import React, { useEffect, useState } from "react";
import { Card, SimpleGrid, Flex, Text } from "@chakra-ui/react";
import { fetchInvestedProjects } from "@/components/fetchData";
import { useAccount } from "wagmi";
import CardProject from "../researcher/CardProject";
import { v4 as uuidv4 } from "uuid";

function myInvestissements() {
   const [investedProjects, setInvestedProjects] = useState([]);
   const { address } = useAccount();

   useEffect(() => {
      fetchInvestedProjects(setInvestedProjects, address);
   }, []);

   return (
      <div>
         {" "}
         <div>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
               My investments
            </Text>
            <Flex justifyContent="center" alignItems="center" mt={100}>
               <SimpleGrid
                  spacing={4}
                  templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
               >
                  {investedProjects && investedProjects.length > 0 ? (
                     investedProjects.map((project) => (
                        <Card key={uuidv4()} marginBottom="4">
                           <CardProject project={project} />
                        </Card>
                     ))
                  ) : (
                     <span>No project yet</span>
                  )}
               </SimpleGrid>
            </Flex>
         </div>
      </div>
   );
}

export default myInvestissements;
