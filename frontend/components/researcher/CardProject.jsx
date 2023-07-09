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
import Link from "next/link";
import { useFundsContext } from "@/context/fundsContext";

function CardProject({ project }) {
   const { fetchProjectInfo, projectInfo } = useProject();
   const { setProjectInfoContext } = useFundsContext();

   useEffect(() => {
      fetchProjectInfo(project.projectId);
   }, [project]);

   useEffect(() => {
      setProjectInfoContext(projectInfo);
   }, [projectInfo]);

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
                  <Link href="/project">
                     <Heading size="s" color="#3182CE">
                        Details
                     </Heading>
                  </Link>
               </CardFooter>
            </>
         ) : null}
      </>
   );
}

export default CardProject;
