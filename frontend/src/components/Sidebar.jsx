
import {
  Box,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Icon,
  Badge,
  Tooltip,
  Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiLogOut, FiPlus, FiUsers } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setSelectedGroup }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [groups, setGroups] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    fetchGroups();
  }, []);

  const getStoredUser = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("userInfo"));
      if (!stored) return {};
      return { ...stored.user, token: stored.token };
    } catch {
      return {};
    }
  };

  const checkAdminStatus = () => {
    const user = getStoredUser();
    setIsAdmin(user.isAdmin || false);
  };

  const fetchGroups = async () => {
    try {
      const user = getStoredUser();
      const token = user.token;
      if (!token) return;

      const { data } = await axios.get("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups(data);

      const userGroupIds = data
        ?.filter((group) =>
          group.members?.some((member) => member._id === user._id)
        )
        .map((group) => group._id);

      setUserGroups(userGroupIds);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const createGroup = async () => {
    try {
      const user = getStoredUser();
      const token = user.token;
      if (!token) return;

      await axios.post(
        "http://localhost:5000/api/groups",
        { name: newGroupName, description: newGroupDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Group created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setNewGroupName("");
      setNewGroupDescription("");
      onClose();
      fetchGroups();
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error creating group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const user = getStoredUser();
      const token = user.token;
      if (!token) return;

      await axios.post(
        `http://localhost:5000/api/groups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Joined group successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchGroups();
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        title: "Error joining group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const user = getStoredUser();
      const token = user.token;
      if (!token) return;

      await axios.post(
        `http://localhost:5000/api/groups/${groupId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Left group successfully!",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      fetchGroups();
      setSelectedGroup(null);
    } catch (error) {
      console.error("Error leaving group:", error);
      toast({
        title: "Error leaving group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    toast({
      title: "Logged out successfully!",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    navigate("/login");
  };

  return (
    <Box
      h="100%"
      bgGradient="linear(to-b,purple.100,white)"
      width="300px"
      display="flex"
      flexDirection="column"
      borderRight="1px solid"
      borderColor="purple.300"
      color="purple.900"
      position="relative"
    >
      {/* Header */}
      <Flex
        p={4}
        borderBottom="1px solid"
        borderColor="purple.300"
        align="center"
        justify="space-between"
      >
        <Flex align="center">
          <Icon as={FiUsers} fontSize="24px" color="purple.700" mr={2} />
          <Text fontSize="xl" fontWeight="bold">
            Groups
          </Text>
        </Flex>
        {isAdmin && (
          <Tooltip label="Create New Group">
            <Button
              size="sm"
              colorScheme="purple"
              variant="ghost"
              onClick={onOpen}
              borderRadius="full"
            >
              <Icon as={FiPlus} fontSize="20px" />
            </Button>
          </Tooltip>
        )}
      </Flex>

      {/* Groups List */}
      <Box flex="1" overflowY="auto" p={4} mb="80px">
        <VStack spacing={3} align="stretch">
          {groups.map((group) => {
            const isMember = userGroups.includes(group._id);
            return (
              <Box
                key={group._id}
                p={4}
                borderRadius="lg"
                bg={isMember ? "purple.50" : "whiteAlpha.700"}
                borderWidth="1px"
                borderColor={isMember ? "purple.300" : "purple.200"}
                transition="all 0.2s"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "md",
                  bg: "purple.100",
                }}
                cursor="pointer"
                onClick={() => isMember && setSelectedGroup(group)}
              >
                <Flex justify="space-between" align="center">
                  <Box flex="1">
                    <Flex align="center" mb={1}>
                      <Text fontWeight="bold" color="purple.800">
                        {group.name}
                      </Text>
                      {isMember && (
                        <Badge ml={2} colorScheme="purple">
                          Joined
                        </Badge>
                      )}
                    </Flex>
                    <Text fontSize="sm" color="purple.600" noOfLines={2}>
                      {group.description}
                    </Text>
                  </Box>

                  <Button
                    size="sm"
                    colorScheme={isMember ? "pink" : "purple"}
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      isMember
                        ? handleLeaveGroup(group._id)
                        : handleJoinGroup(group._id);
                    }}
                  >
                    {isMember ? "Leave" : "Join"}
                  </Button>
                </Flex>
              </Box>
            );
          })}
        </VStack>
      </Box>

      {/* Logout Button */}
      <Box
        p={4}
        borderTop="1px solid"
        borderColor="purple.300"
        bg="purple.100"
        position="absolute"
        bottom={0}
        width="100%"
      >
        <Button
          width="full"
          variant="solid"
          colorScheme="red"
          leftIcon={<Icon as={FiLogOut} />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Create Group Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Group Name</FormLabel>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Enter group description"
              />
            </FormControl>

            <Button
              colorScheme="purple"
              mt={4}
              width="full"
              onClick={createGroup}
            >
              Create Group
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Sidebar;



