import {
   CardHeader,
   CardBody,
   CardFooter,
   Heading,
   Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useResearcher } from "@/hooks/useResearcher";

function CardProject({ project }) {
   const { fetchProjectInfo, projectInfo } = useResearcher();

   useEffect(() => {
      fetchProjectInfo(project.projectId);
   }, [project]);

   return (
      <>
         {projectInfo ? (
            <>
               <CardHeader>
                  <Heading size="sm"> Proposal {projectInfo.title}</Heading>
               </CardHeader>
               <CardBody>
                  {projectInfo.description.slice(0, 100)} + "..."
               </CardBody>
               <Divider />
               <CardFooter>
                  <Heading size="s" color="#3182CE">
                     Details
                  </Heading>
               </CardFooter>
            </>
         ) : null}
      </>
   );
}

export default CardProject;
