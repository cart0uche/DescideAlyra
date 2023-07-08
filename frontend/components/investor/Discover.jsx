import { Card, SimpleGrid, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useProject } from "@/hooks/useProject";
import CardProject from "../researcher/CardProject";
import { v4 as uuidv4 } from "uuid";

function Discover() {
   const { projects } = useProject();

   console.log(projects);

   return (
      <div>
         <Flex justifyContent="center" alignItems="center" mt={100}>
            <SimpleGrid
               spacing={4}
               templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            >
               {projects && projects.length > 0 ? (
                  projects.map((project) => (
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
   );
}

export default Discover;
