
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Flex,
  VStack,
  HStack,
  Badge,
  chakra,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiMessageSquare,
  FiUsers,
  FiLock,
  FiUserPlus,
  FiGlobe,
  FiActivity,
  FiUserCheck,
} from "react-icons/fi";
import HeroSection from "../components/HeroSection"; 

const Feature = ({ title, text, icon, badges = [] }) => (
  <Stack
    bg={useColorModeValue("whiteAlpha.700", "whiteAlpha.100")}
    backdropFilter="blur(7px)"
    boxShadow="0 12px 32px rgba(128,90,213,0.10)"
    rounded="2xl"
    p={8}
    spacing={5}
    border="1px solid"
    borderColor={useColorModeValue("gray.100", "gray.700")}
    transition="all 0.35s cubic-bezier(.36,.86,.43,.78)"
    _hover={{
      transform: "translateY(-8px) scale(1.025)",
      boxShadow: "0 0 0 3px #805ad5, 0 18px 36px rgba(128,90,213,0.18)",
    }}
  >
    <Flex
      w={16}
      h={16}
      align="center"
      justify="center"
      color="white"
      rounded="full"
      bgGradient="linear(to-tr, purple.400, purple.600)"
      fontSize="2xl"
    >
      {icon}
    </Flex>
    <Box>
      <HStack spacing={2} mb={2}>
        <Text fontWeight={700} fontSize="xl">
          {title}
        </Text>
        {badges.map((badge, i) => (
          <Badge
            key={i}
            colorScheme={badge.color}
            variant="solid"
            rounded="full"
            px={3}
            fontSize="sm"
          >
            {badge.text}
          </Badge>
        ))}
      </HStack>
      <Text color={useColorModeValue("gray.600", "gray.300")}>{text}</Text>
    </Box>
  </Stack>
);

export default function LandingPage() {
  return (
    <Box
      bgGradient={useColorModeValue(
        "linear(to-br, purple.100 60%, white 100%)",
        "linear(to-br, gray.900, purple.900 80%)"
      )}
      minH="100vh"
    >
      {/* Navbar */}
      <Flex
        as="nav"
        px={8}
        py={4}
        align="center"
        justify="space-between"
        bg="whiteAlpha.800"
        backdropFilter="blur(10px)"
        position="sticky"
        top={0}
        zIndex={10}
        boxShadow="md"
      >
        <Heading size="md" color="purple.600" letterSpacing="tight">
          Chatly
        </Heading>
        <HStack spacing={6}>
          <Link as={RouterLink} to="/" fontWeight="semibold" color="gray.700">
            Home
          </Link>
          <Link
            as={RouterLink}
            to="/login"
            fontWeight="semibold"
            color="gray.700"
            _hover={{ color: "purple.500" }}
          >
            Login
          </Link>
          <Button
            as={RouterLink}
            to="/register"
            size="sm"
            colorScheme="purple"
            leftIcon={<FiUserPlus />}
            rounded="full"
          >
            Sign Up
          </Button>
        </HStack>
      </Flex>

      <Container maxW="7xl" pt={14}>
        {/* New Modular Hero Section */}
        <HeroSection />

        {/* Features */}
        <Box py={20}>
          <VStack spacing={3} textAlign="center" mb={14}>
            <Heading fontSize="4xl" fontWeight="extrabold">
              Powerful Collaboration Tools
            </Heading>
            <Text
              fontSize="lg"
              color="gray.500"
              fontWeight="medium"
              maxW="450px"
            >
              Everything you need to stay connected and productive
            </Text>
          </VStack>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={12}
            px={{ base: 4, md: 10 }}
          >
            <Feature
              icon={<Icon as={FiLock} w={10} h={10} />}
              title="Secure Authentication"
              badges={[{ text: "Secure", color: "green" }]}
              text="Register and login securely with encrypted passwords and JWT authentication."
            />
            <Feature
              icon={<Icon as={FiUsers} w={10} h={10} />}
              title="Group Management"
              badges={[{ text: "Real-time", color: "purple" }]}
              text="Create, join, or leave groups seamlessly and chat instantly."
            />
            <Feature
              icon={<Icon as={FiUserCheck} w={10} h={10} />}
              title="Online Presence"
              badges={[{ text: "Live", color: "green" }]}
              text="See who’s online and active in real time."
            />
            <Feature
              icon={<Icon as={FiActivity} w={10} h={10} />}
              title="Typing Indicators"
              badges={[{ text: "Interactive", color: "pink" }]}
              text="Know when your teammates are typing live."
            />
            <Feature
              icon={<Icon as={FiMessageSquare} w={10} h={10} />}
              title="Instant Messaging"
              badges={[{ text: "Fast", color: "orange" }]}
              text="Send and receive messages with lightning-fast delivery."
            />
            <Feature
              icon={<Icon as={FiGlobe} w={10} h={10} />}
              title="Global Access"
              badges={[{ text: "24/7", color: "purple" }]}
              text="Access your chats anywhere, anytime, on any device."
            />
          </SimpleGrid>
        </Box>

        {/* Discover Groups Section */}
        <Box py={20}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={12}
            align="center"
            justify="center"
            bgGradient="linear(to-br, purple.100 65%, white 100%)"
            p={14}
            rounded="2xl"
            shadow="xl"
            border="1px solid"
            borderColor="purple.200"
          >
            <VStack align="flex-start" spacing={4}>
              <Heading
                size="lg"
                color="purple.700"
                fontWeight="extrabold"
                letterSpacing="tight"
              >
                Discover Groups & Start Chatting!
              </Heading>
              <Text color="purple.800" fontSize="lg" fontWeight="medium">
                Join thousands of users collaborating in real-time.
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/login"
              size="lg"
              colorScheme="purple"
              bgGradient="linear(to-br, purple.500, purple.400)"
              rightIcon={<FiMessageSquare />}
              fontWeight="bold"
              px={10}
              py={6}
              rounded="full"
              _hover={{
                bgGradient: "linear(to-br, purple.700, purple.400)",
                transform: "scale(1.08)",
              }}
            >
              Explore Chatly
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Footer */}
      <Box textAlign="center" py={8} color="gray.500" fontSize="sm">
        © {new Date().getFullYear()} Chatly — Built with 💜 using React & Chakra UI
      </Box>
    </Box>
  );
}
