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

function Subscribe() {
   const { address } = useAccount();
   const { subscribe, isLoadingSubscribe } = useResearcher();
   const [inputValue, setInputValue] = useState({
      firstName: "",
      lastName: "",
      company: "",
   });
   const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      company: "",
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
         firstName: "",
         lastName: "",
         company: "",
      });
   };

   useEffect(() => {
      if (
         formData.firstName !== "" &&
         formData.lastName !== "" &&
         formData.company !== ""
      ) {
         console.log("WRITE !  ");
         subscribe({
            args: [
               address,
               formData.firstName,
               formData.lastName,
               formData.company,
            ],
         });
      }

      return () => {
         setFormData({
            firstName: "",
            lastName: "",
            company: "",
         });
      };
   }, [formData]);

   return (
      <Box
         p={4}
         borderWidth="1px"
         borderRadius="md"
         maxW="400px"
         mx="auto"
         boxShadow="md"
      >
         <VStack spacing={4}>
            <FormControl id="firstName">
               <FormLabel>Prénom</FormLabel>
               <Input
                  name="firstName"
                  type="text"
                  value={inputValue.firstName}
                  onChange={handleChange}
               />
            </FormControl>

            <FormControl id="lastName">
               <FormLabel>Nom</FormLabel>
               <Input
                  name="lastName"
                  type="text"
                  value={inputValue.lastName}
                  onChange={handleChange}
               />
            </FormControl>

            <FormControl id="company">
               <FormLabel>Compagnie</FormLabel>
               <Input
                  name="company"
                  type="text"
                  value={inputValue.company}
                  onChange={handleChange}
               />
            </FormControl>

            <Button
               colorScheme="blue"
               onClick={handleSubmit}
               isLoading={isLoadingSubscribe}
            >
               Valider
            </Button>
         </VStack>
      </Box>
   );
}

export default Subscribe;
