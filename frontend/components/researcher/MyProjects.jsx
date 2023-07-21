import { Card, SimpleGrid, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchProject } from "@/components/fetchData";
import CardProject from "./CardProject";
import { v4 as uuidv4 } from "uuid";
import { useAccount } from "wagmi";

function MyProjects() {
   const [projects, setProjects] = useState([]);
   const [myProjects, setMyProjects] = useState([]);
   const { address } = useAccount();

   useEffect(() => {
      fetchProject(setProjects);
   }, []);

   useEffect(() => {
      setMyProjects(
         projects.filter((project) => project.researcherAddress === address)
      );
   }, [projects]);

   return (
      <div>
         <Flex justifyContent="center" alignItems="center" mt={100}>
            <SimpleGrid
               spacing={4}
               templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            >
               {myProjects && myProjects.length > 0 ? (
                  myProjects.map((project) => (
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

export default MyProjects;
