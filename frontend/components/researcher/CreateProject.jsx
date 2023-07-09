import { useEffect, useState } from "react";
import {
   FormControl,
   FormLabel,
   Input,
   Button,
   VStack,
   Box,
} from "@chakra-ui/react";
import { useProject } from "@/hooks/useProject";
import UploadIPFS from "@/components/utils/UploadIPFS";

function CreateProject() {
   const { createProject, isLoadingCreateProject } = useProject();
   const [inputValue, setInputValue] = useState({
      projectTitle: "",
      projectDescription: "",
      amountAsked: "",
      imageUrl: "",
      projectDetailsUri: "",
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setInputValue((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const setFileUrlImage = (url) => {
      setInputValue((prevData) => ({
         ...prevData,
         imageUrl: url,
      }));
   };

   const setFileUrlLitepaper = ( url) => {
      setInputValue((prevData) => ({
         ...prevData,
         projectDetailsUri: url,
      }));
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      createProject({
         args: [
            inputValue.projectTitle,
            inputValue.projectDescription,
            inputValue.imageUrl,
            inputValue.amountAsked,
            inputValue.projectDetailsUri,
         ],
      });
   };

   return (
      <div>
         <Box
            p={4}
            borderWidth="1px"
            borderRadius="md"
            maxW="400px"
            mx="auto"
            boxShadow="md"
            mt={20}
         >
            <VStack spacing={4}>
               <FormControl id="projectTitle">
                  <FormLabel>Project name</FormLabel>
                  <Input
                     name="projectTitle"
                     type="text"
                     value={inputValue.projectTitle}
                     onChange={handleChange}
                  />
               </FormControl>

               <FormControl id="projectDescription">
                  <FormLabel>Project description</FormLabel>
                  <Input
                     name="projectDescription"
                     type="text"
                     value={inputValue.projectDescription}
                     onChange={handleChange}
                  />
               </FormControl>

               <FormControl id="amountAsked">
                  <FormLabel>Amount asked</FormLabel>
                  <Input
                     name="amountAsked"
                     type="text"
                     value={inputValue.amountAsked}
                     onChange={handleChange}
                  />
               </FormControl>

               <FormControl id="image">
                  <FormLabel>Image</FormLabel>
                  <UploadIPFS setFileUrl={setFileUrlImage} />
               </FormControl>

               <FormControl id="image">
                  <FormLabel>Litepaper</FormLabel>
                  <UploadIPFS setFileUrl={setFileUrlLitepaper} />
               </FormControl>

               <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  isLoading={isLoadingCreateProject}
               >
                  Valider
               </Button>
            </VStack>
         </Box>
      </div>
   );
}

export default CreateProject;
