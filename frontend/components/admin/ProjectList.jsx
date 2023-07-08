import {
   Flex,
   Box,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   TableContainer,
} from "@chakra-ui/react";
import { useProject } from "@/hooks/useProject";
import { v4 as uuidv4 } from "uuid";
import OneProject from "./OneProject";

function ProjectList() {
   const { projects } = useProject();

   console.log("projects :");
   console.log(projects);

   return (
      <div>
         {" "}
         <div>
            <Flex justifyContent="center">
               <Box
                  m={4}
                  borderWidth="1px"
                  color="#3182CE"
                  borderColor="#3182CE"
               >
                  <TableContainer>
                     <Table variant="simple" size="lg">
                        <Thead>
                           <Tr key={uuidv4()}>
                              <Th textAlign="center">Project id</Th>
                              <Th textAlign="center">Researcher address</Th>
                           </Tr>
                        </Thead>

                        <Tbody>
                           {projects &&
                              projects.map((project) => (
                                 <OneProject key={uuidv4()} project={project} />
                              ))}
                        </Tbody>
                     </Table>
                  </TableContainer>
               </Box>
            </Flex>
         </div>
      </div>
   );
}

export default ProjectList;
