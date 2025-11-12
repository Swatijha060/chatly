import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Image,
  useToast,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Please fill in all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      height="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-r, purple.50, white)"
      px={{ base: 4, md: 10 }}
    >
      <Flex
        bg="white"
        boxShadow="lg"
        borderRadius="2xl"
        overflow="hidden"
        w={{ base: "100%", sm: "90%", md: "850px" }}
        h={{ base: "auto", md: "550px" }}
        flexDir={{ base: "column", md: "row" }}
      >
        {/* Left Section - Illustration */}
        <Box
          flex="1"
          bg="purple.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={6}
        >
          <Box textAlign="center">
            <Image
              src="/Login_Image.png"
              alt="Chat Illustration"
              borderRadius="xl"
              mb={6}
              maxH="280px"
              mx="auto"
            />
            <Heading size="md" color="purple.700" fontWeight="bold">
              Welcome Back to Chatly
            </Heading>
            <Text fontSize="sm" color="purple.600" mt={2}>
              Connect instantly with your friends and start chatting now 
            </Text>
          </Box>
        </Box>

        {/* Right Section - Login Form */}
        <Box flex="1" p={{ base: 8, md: 12 }} display="flex" flexDir="column" justify="center">
          <Heading
            as="h2"
            size="lg"
            color="purple.700"
            mb={2}
            textAlign="center"
            fontFamily="'Poppins', sans-serif"
          >
            Sign In to Chatly
          </Heading>
          <Text textAlign="center" color="gray.600" mb={8}>
            Welcome back! Enter your details below to continue chatting.
          </Text>

          <FormControl id="email" mb={5}>
            <FormLabel fontWeight="medium" color="purple.700">
              Email address
            </FormLabel>
            <Input
              type="email"
              placeholder="Enter your email "
              value={email}
              bg="gray.50"
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="purple.400"
              size="lg"
            />
          </FormControl>

          <FormControl id="password" mb={6}>
            <FormLabel fontWeight="medium" color="purple.700">
              Password
            </FormLabel>
            <InputGroup size="lg">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                bg="gray.50"
                onChange={(e) => setPassword(e.target.value)}
                focusBorderColor="purple.400"
              />
              <InputRightElement>
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            colorScheme="purple"
            size="lg"
            leftIcon={<FiLogIn />}
            onClick={handleLogin}
            isLoading={loading}
            loadingText="Signing In"
            borderRadius="xl"
          >
            Sign In
          </Button>

          <Text textAlign="center" mt={6} color="gray.600">
            Don’t have an account?{" "}
            <Link color="purple.600" fontWeight="medium" href="/register">
              Register now
            </Link>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;



