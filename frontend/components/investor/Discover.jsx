import { Card, SimpleGrid, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CardProject from "../researcher/CardProject";
import { fetchProject } from "@/components/fetchData";
import { v4 as uuidv4 } from "uuid";

function Discover() {
   const [projects, setProjects] = useState([]);

   useEffect(() => {
      fetchProject(setProjects);
   }, []);

   return (
      <div>
         <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            All projects
         </Text>
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
