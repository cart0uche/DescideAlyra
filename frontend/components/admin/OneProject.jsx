import { Button, Tr, Td } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
import { useProject } from "@/hooks/useProject";
import { useEffect } from "react";

function OneProject({ project }) {
   const {
      fetchProjectInfo,
      validProject,
      isLoadingValidProject,
      projectInfo,
   } = useProject();

   useEffect(() => {
      fetchProjectInfo(project.projectId);
   }, [project]);

   const getProjectInfo = () => {
      if (projectInfo !== undefined && projectInfo.status != 0) {
         return <CheckIcon />;
      } else {
         return (
            <Button
               isLoading={isLoadingValidProject}
               onClick={() => {
                  validProject({ args: [project.projectId] });
               }}
            >
               Valid
            </Button>
         );
      }
   };

   console.log("fetchProjectInfo ", projectInfo);

   return (
      <Tr key={uuidv4()}>
         <Td>{Number(project.projectId)}</Td>
         <Td>{project.researcherAddress}</Td>
         <Td>{getProjectInfo()}</Td>
      </Tr>
   );
}

export default OneProject;
