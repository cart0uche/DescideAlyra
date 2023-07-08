import React from "react";
import ResearchList from "./ResearchList";
import {
   Tabs,
   TabList,
   TabPanels,
   Tab,
   TabPanel,
   Flex,
   Box,
} from "@chakra-ui/react";
import ProjectList from "./ProjectList";

function Admin() {
   return (
      <div>
         <Tabs variant="soft-rounded" align="center">
            <TabList>
               <Tab>Validate Researcher</Tab>
               <Tab>Validate Projects</Tab>
            </TabList>

            <TabPanels>
               <TabPanel>
                  <Flex justifyContent="center" alignItems="center">
                     <Box w="300px">
                        <ResearchList />
                     </Box>
                  </Flex>
               </TabPanel>
               <TabPanel>
                  <Flex justifyContent="center" alignItems="center">
                     <Box w="300px">
                        <ProjectList />
                     </Box>
                  </Flex>
               </TabPanel>
            </TabPanels>
         </Tabs>
      </div>
   );
}

export default Admin;
