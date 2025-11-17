import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

const API = "https://chatly-8w8p.onrender.com";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !email || !password) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${API}/api/users/register`, {
        username,
        email,
        password,
      });

      toast({
        title: "Registration Successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Registration Failed!",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, indigo.500, purple.500)"
    >
      <Box
        display="flex"
        w={["95%", "90%", "80%", "75%"]}
        maxW="1200px"
        h={["auto", "auto", "600px"]}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="2xl"
      >
        {/* Left panel (hidden on mobile) */}
        <Box
          display={["none", "none", "flex"]}
          w="50%"
          bgImage="url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')"
          bgSize="cover"
          bgPosition="center"
          position="relative"
        >
          <Box
            position="absolute"
            inset="0"
            bg="blackAlpha.600"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            p={10}
            color="white"
          >
            <Text fontSize="4xl" fontWeight="bold" mb={4}>
              Join Our Chat Community
            </Text>
            <Text fontSize="lg" maxW="400px">
              Connect with friends and start chatting instantly.
            </Text>
          </Box>
        </Box>

        {/* Right panel - form */}
        <Box
          w={["100%", "100%", "50%"]}
          bg="white"
          p={[6, 8, 10]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box display={["block", "block", "none"]} textAlign="center" mb={6}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Create Account
            </Text>
          </Box>

          <VStack spacing={5} w="100%" maxW="400px" mx="auto" as="form" onSubmit={handleSubmit}>
            <FormControl id="username" isRequired>
              <FormLabel color="gray.700">Username</FormLabel>
              <Input
                type="text"
                size="lg"
                bg="gray.50"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel color="gray.700">Email</FormLabel>
              <Input
                type="email"
                size="lg"
                bg="gray.50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel color="gray.700">Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  bg="gray.50"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement>
                  <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="purple"
              width="100%"
              size="lg"
              mt={4}
              isLoading={loading}
            >
              Create Account
            </Button>

            <Text color="gray.600" pt={4}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "purple", fontWeight: "500" }}>
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;


