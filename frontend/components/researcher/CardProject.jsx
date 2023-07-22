import {
   CardHeader,
   CardBody,
   CardFooter,
   Heading,
   Divider,
   Spacer,
   Flex,
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

   const getNFTType = (typeNFT) => {
      switch (typeNFT) {
         case 0:
            return "Classic";
         case 1:
            return "Plus";
         case 2:
            return "Premium";
         case 3:
            return "VIP";
         default:
            return "";
      }
   };

   return (
      <>
         {projectInfo ? (
            <>
               <CardHeader>
                  <Heading size="sm"> {projectInfo.title}</Heading>
               </CardHeader>
               <CardBody>
                  <Image
                     src={"https://ipfs.io/ipfs/" + projectInfo.imageUrl}
                     width={100}
                     height={100}
                     alt="image"
                  />
                  {projectInfo.description.slice(0, 100)} ...
               </CardBody>
               <Divider />
               <CardFooter>
                  <Flex justifyContent="center" direction="column">
                     {project.typeNFT !== undefined ? (
                        <Heading as="h2" size="s">
                           You own {getNFTType(Number(project.typeNFT))} NFT
                        </Heading>
                     ) : null}

                     <Link href="/project" legacyBehavior>
                        <a onClick={handleDetailClick}>
                           <Heading as="h2" size="s" color="#3182CE">
                              Details
                           </Heading>
                        </a>
                     </Link>
                  </Flex>
               </CardFooter>
            </>
         ) : null}
      </>
   );
}

export default CardProject;
