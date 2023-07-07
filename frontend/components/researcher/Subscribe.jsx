import { useEffect, useState } from "react";
import {
   FormControl,
   FormLabel,
   Input,
   Button,
   VStack,
   Box,
   useToast,
} from "@chakra-ui/react";
import { useContractWrite, useAccount } from "wagmi";
import Contract from "@/public/FundsFactory.json";

function Subscribe() {
   const toast = useToast();
   const { address } = useAccount();
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
         write();
      }

      return () => {
         setFormData({
            firstName: "",
            lastName: "",
            company: "",
         });
      };
   }, [formData]);

   const { write, isLoading } = useContractWrite({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: Contract.abi,
      functionName: "addResearcher",
      args: [address, formData.firstName, formData.lastName, formData.company],
      onError: (error) => {
         console.log(error);
         toast({
            status: "error",
            isClosable: true,
            position: "top-middle",
            title: "L'inscription a échoué",
            description: error.message,
         });
      },
      onSuccess: (data) => {
         toast({
            status: "info",
            isClosable: true,
            position: "top-middle",
            title: "Inscription réalisée",
         });
      },
   });

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
               isLoading={isLoading}
            >
               Valider
            </Button>
         </VStack>
      </Box>
   );
}

export default Subscribe;
