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
import { useRouter } from "next/navigation";
import { useFundsContext } from "@/context/fundsContext";

function CardProject({ project }) {
   const router = useRouter();
   const { fetchProjectInfo, projectInfo } = useProject();
   const { setProjectInfoContext } = useFundsContext();

   useEffect(() => {
      fetchProjectInfo(project.projectId);
   }, [project]);

   const handleDetailClick = () => {
      console.log("handleDetailClick");
      setProjectInfoContext(projectInfo);
      router.push("/project");
   };

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
                  <Link href="/project" legacyBehavior>
                     <a onClick={handleDetailClick}>
                        <Heading as="h2" size="s" color="#3182CE">
                           Details
                        </Heading>
                     </a>
                  </Link>
               </CardFooter>
            </>
         ) : null}
      </>
   );
}

export default CardProject;
