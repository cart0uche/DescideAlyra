import { useEffect, useState } from "react";
import {
   FormControl,
   FormLabel,
   Input,
   Button,
   VStack,
   Box,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useResearcher } from "@/hooks/useResearcher";

function CreateProject() {
   const { address } = useAccount();
   const { createProject, isLoadingCreateProject } = useResearcher();
   const [inputValue, setInputValue] = useState({
      projectName: "",
      amountAsked: "",
      projectDetailsUri: "",
   });
   const [formData, setFormData] = useState({
      projectName: "",
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
         projectName: "",
         amountAsked: "",
         projectDetailsUri: "",
      });
   };

   useEffect(() => {
      if (
         formData.projectName !== "" &&
         formData.amountAsked !== "" &&
         formData.projectDetailsUri !== ""
      ) {
         console.log("WRITE !");
         createProject({
            args: [formData.amountAsked, formData.projectDetailsUri],
         });
      }

      return () => {
         setFormData({
            projectName: "",
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
         >
            <VStack spacing={4}>
               <FormControl id="projectName">
                  <FormLabel>Project name</FormLabel>
                  <Input
                     name="projectName"
                     type="text"
                     value={inputValue.name}
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
