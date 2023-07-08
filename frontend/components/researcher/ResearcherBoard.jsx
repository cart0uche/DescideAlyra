import {
   Tabs,
   TabList,
   TabPanels,
   Tab,
   TabPanel,
   Flex,
   Box,
} from "@chakra-ui/react";
import CreateProject from "./CreateProject";

function ResearcherBoard() {
   return (
      <div>
         <Tabs variant="soft-rounded" align="center">
            <TabList>
               <Tab>My projects</Tab>
               <Tab>Create a project</Tab>
            </TabList>

            <TabPanels>
               <TabPanel></TabPanel>
               <TabPanel>
                  <Flex justifyContent="center" alignItems="center">
                     <Box w="300px">
                        <CreateProject />
                     </Box>
                  </Flex>
               </TabPanel>
            </TabPanels>
         </Tabs>
      </div>
   );
}

export default ResearcherBoard;
