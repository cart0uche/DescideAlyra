import React from "react";
import { Card, Button, Progress, Box, Text } from "@chakra-ui/react";
import { useFundRequest } from "@/hooks/useFundRequest";

function ChangeProjectStatus({ projectInfoContext }) {
   const { openFundsRequest, isLoadingOpenFundsRequest } = useFundRequest();
   return (
      <div>
         {projectInfoContext.status == 1 ? (
            <Button
               colorScheme="blue"
               size="lg"
               width="100%"
               mt={4}
               onClick={() =>
                  openFundsRequest({ args: [projectInfoContext.id] })
               }
               isLoading={isLoadingOpenFundsRequest}
            >
               Open Fund Request
            </Button>
         ) : projectInfoContext.status == 2 ? (
            <Button
               colorScheme="blue"
               size="lg"
               width="100%"
               mt={4}
               onClick={() =>
                  openFundsRequest({ args: [projectInfoContext.id] })
               }
            >
               Manage Fund Request
            </Button>
         ) : (
            null
         )}
      </div>
   );
}

export default ChangeProjectStatus;
