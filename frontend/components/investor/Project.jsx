import { useFundsContext } from "@/context/fundsContext";
import {
  Box,
  Flex,
  Heading,
  Image,
  Link,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaEthereum, FaClock, FaCheckCircle } from "react-icons/fa";
import Mint from "./Mint";

function Project() {
  const { projectInfoContext } = useFundsContext();

  const getStatusProject = (status) => {
    switch (status) {
      case 0:
        return "Waiting for validation";
      case 1:
        return "Available for funding";
      case 2:
        return "Ready for funding";
      case 3:
        return "Ended";
      default:
        return "";
    }
  };

  return (
    <Flex direction="column" p={8} alignItems="center">
      <Box
        borderWidth="1px"
        borderRadius="md"
        p={8}
        boxShadow="md"
        bg="white"
        width="100%"
        maxWidth="900px"
      >
        <Flex direction="column" alignItems="center" mb={6}>
          <Heading size="2xl" textAlign="center">
            {projectInfoContext.title}
          </Heading>
          <Text fontSize="lg" mt={2} color="gray.500">
            by {projectInfoContext.researcher}
          </Text>
        </Flex>

        <Flex
          direction={{ base: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          mb={8}
        >
          <Box
            position="relative"
            width={{ base: "100%", md: "50%" }}
            height="auto"
            mb={{ base: 4, md: 0 }}
          >
            <Image
              src={projectInfoContext.imageUrl}
              layout="responsive"
              objectFit="cover"
              alt="Project Image"
            />
          </Box>

          <Stack
            direction="column"
            alignItems={{ base: "flex-start", md: "flex-end" }}
            ml={{ base: 0, md: 6 }}
            mt={{ base: 4, md: 0 }}
            textAlign={{ base: "left", md: "right" }}
          >
            <Stack direction="row" alignItems="center" mb={4}>
              <FaEthereum size={24} color="gray.500" />
              <Text fontSize="xl" fontWeight="bold">
                Goal:
              </Text>
              <Text fontSize="xl">
                {Number(projectInfoContext.amountAsked)} ETH
              </Text>
            </Stack>

            <Mint projectInfoContext={projectInfoContext} />

            <Stack direction="row" alignItems="center" mb={4}>
              <FaClock size={24} color="gray.500" />
              <Text fontSize="xl" fontWeight="bold">
                Status:
              </Text>
              <Text fontSize="xl" color="blue.500">
                {getStatusProject(projectInfoContext.status)}
              </Text>
            </Stack>

            <Link href={projectInfoContext.projectDetailsUri}>
              <Text
                fontSize="xl"
                color="blue.500"
                fontWeight="bold"
                _hover={{ textDecoration: "underline" }}
              >
                View Litepaper
              </Text>
            </Link>
          </Stack>
        </Flex>

        <Text fontSize="xl" mb={8} maxWidth="100%">
          {projectInfoContext.description}
        </Text>

        {projectInfoContext.status === 1 && (
          <Flex justify="flex-end" mb={8}>
            <Link href="#" passHref>
              <Box
                as="a"
                display="inline-block"
                bg="blue.500"
                color="white"
                borderRadius="md"
                py={4}
                px={6}
                fontSize="xl"
                fontWeight="bold"
                _hover={{ bg: "blue.600" }}
              >
                Fund this project
              </Box>
            </Link>
          </Flex>
        )}

        {projectInfoContext.status === 2 && (
          <Flex justify="flex-end" mb={8}>
            <Box
              display="flex"
              alignItems="center"
              bg="green.500"
              color="white"
              borderRadius="md"
              py={2}
              px={4}
              fontSize="xl"
              fontWeight="bold"
            >
              <FaCheckCircle size={24} style={{ marginRight: "8px" }} />
              Funding in progress
            </Box>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

export default Project;
