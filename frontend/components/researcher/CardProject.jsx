import {
   CardHeader,
   CardBody,
   CardFooter,
   Heading,
   Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useProject } from "@/hooks/useProject";
import Image from "next/image";

function CardProject({ project }) {
   const { fetchProjectInfo, projectInfo } = useProject();

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
                  <Image
                     src={projectInfo.imageUrl}
                     width={100}
                     height={100}
                     alt="image"
                  />
                  {projectInfo.description.slice(0, 100)} ...
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
