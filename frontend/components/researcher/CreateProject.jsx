import { useEffect, useState } from "react";
import {
   FormControl,
   FormLabel,
   Input,
   Button,
   VStack,
   Box,
} from "@chakra-ui/react";
import { useResearcher } from "@/hooks/useResearcher";

function CreateProject() {
   const { createProject, isLoadingCreateProject } = useResearcher();
   const [inputValue, setInputValue] = useState({
      projectTitle: "",
      projectDescription: "",
      amountAsked: "",
      projectDetailsUri: "",
   });
   const [formData, setFormData] = useState({
      projectTitle: "",
      projectDescription: "",
      amountAsked: "",
      projectDetailsUri: "",
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setInputValue((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      setFormData(inputValue);
      setInputValue({
         projectTitle: "",
         projectDescription: "",
         amountAsked: "",
         projectDetailsUri: "",
      });
   };

   useEffect(() => {
      if (
         formData.projectTitle !== "" &&
         formData.projectDescription !== "" &&
         formData.amountAsked !== "" &&
         formData.projectDetailsUri !== ""
      ) {
         console.log("WRITE !");
         createProject({
            args: [
               formData.projectTitle,
               formData.projectDescription,
               formData.amountAsked,
               formData.projectDetailsUri,
            ],
         });
      }

      return () => {
         setFormData({
            projectTitle: "",
            projectDescription: "",
            amountAsked: "",
            projectDetailsUri: "",
         });
      };
   }, [formData]);

   return (
      <div>
         {" "}
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
                     value={inputValue.title}
                     onChange={handleChange}
                  />
               </FormControl>

               <FormControl id="projectDescription">
                  <FormLabel>Project description</FormLabel>
                  <Input
                     name="projectDescription"
                     type="text"
                     value={inputValue.description}
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

               <FormControl id="projectDetailsUri">
                  <FormLabel>Link to your whitepaper</FormLabel>
                  <Input
                     name="projectDetailsUri"
                     type="text"
                     value={inputValue.projectDetailsUri}
                     onChange={handleChange}
                  />
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
