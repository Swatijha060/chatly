import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Flex,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { FiUserPlus, FiLogIn } from "react-icons/fi";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

export default function HeroSection() {
  const bgGradient = useColorModeValue(
    "linear(to-br, purple.50, white)",
    "linear(to-br, gray.800, purple.900)"
  );

  return (
    <Flex
      align="center"
      justify="space-between"
      py={{ base: 20, md: 32 }}
      px={{ base: 6, md: 12 }}
      direction={{ base: "column", md: "row" }}
    >
      {/* Left Content */}
      <Stack spacing={8} flex={1}>
        <Heading
          lineHeight={1.1}
          fontWeight={900}
          fontSize={{ base: "3xl", sm: "5xl", lg: "6xl" }}
        >
          <Text as="span" color={useColorModeValue("purple.700", "purple.300")}>
            Chatly
          </Text>{" "}
          — Your Real-Time Group Chat Platform
        </Heading>
        <Text color="gray.600" fontSize="xl" fontWeight="medium" maxW="496px">
          Connect, collaborate, and communicate instantly with teams, friends,
          and communities — anywhere, anytime.
        </Text>

        <Stack spacing={4} direction={{ base: "column", sm: "row" }} mt={6} mb={2}>
          <Button
            as={RouterLink}
            to="/register"
            rounded="full"
            size="lg"
            px={10}
            colorScheme="purple"
            leftIcon={<FiUserPlus />}
          >
            Get Started Free
          </Button>
          <Button
            as={RouterLink}
            to="/login"
            rounded="full"
            size="lg"
            px={8}
            variant="outline"
            colorScheme="purple"
            leftIcon={<FiLogIn />}
          >
            Sign In
          </Button>
        </Stack>
      </Stack>

      {/* Right Image / Animation */}
      <MotionBox
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={{ base: 12, md: 0 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Box
          bgGradient={bgGradient}
          p={4}
          rounded="2xl"
          shadow="2xl"
          border="1px solid"
          borderColor={useColorModeValue("purple.100", "purple.700")}
        >
          {/* Floating animation */}
          <MotionImage
            src="/Chat.png"
            alt="Chat Illustration"
            boxSize={["260px", "360px", "420px"]}
            objectFit="contain"
            draggable="false"
            rounded="xl"
            animate={{
              y: [0, -10, 0], 
              rotate: [0, 1, -1, 0], 
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </Box>
      </MotionBox>
    </Flex>
  );
}
