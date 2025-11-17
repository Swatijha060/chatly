import {
  Box,
  VStack,
  Text,
  Flex,
  Icon,
  Avatar,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  useToast,
  Badge,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";
import { FiSend, FiUsers, FiMessageCircle } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { keyframes } from "@emotion/react";
import UsersList from "./UsersList";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import API from "../utils/axios";

const blink = keyframes`
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
`;

const ChatArea = ({ selectedGroup, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const currentUserId = currentUser?.user?._id || currentUser?._id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket Setup
  useEffect(() => {
    if (!selectedGroup?._id || !socket) return;

    const groupId = selectedGroup._id;

    socket.emit("register user", {
      _id: currentUserId,
      username: currentUser.user?.username || currentUser.username,
    });

    socket.emit("join room", groupId);
    fetchMessages(groupId);

    const handleMessage = (newMsg) => {
      if (newMsg.sender._id === currentUserId) return;

      const container = messagesContainerRef.current;
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 50;

      setMessages((prev) => [...prev, newMsg]);

      if (!isAtBottom) {
        toast({
          title: `${newMsg.sender.username} sent a new message`,
          description: newMsg.content,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }

      if (isAtBottom) scrollToBottom();
    };

    socket.on("message received", handleMessage);
    socket.on("room users", (users) => {
      setConnectedUsers((users || []).filter((u) => u && u._id));
    });

    socket.on("user typing", (user) => {
      if (user._id !== currentUserId) {
        setTypingUser(user.username);
        clearTimeout(window.typingTimeout);
        window.typingTimeout = setTimeout(() => setTypingUser(null), 2000);
      }
    });

    socket.on("user stop typing", () => setTypingUser(null));

    return () => {
      socket.emit("leave room", groupId);
      socket.off("message received", handleMessage);
      socket.off("room users");
      socket.off("user typing");
      socket.off("user stop typing");
    };
  }, [selectedGroup?._id, socket]);

  // Fetch all messages
  const fetchMessages = async (groupId) => {
    try {
      // UPDATED axios → API
      const { data } = await API.get(`/api/messages/${groupId}`);

      setMessages(data.reverse());
    } catch (error) {
      toast({
        title: "Failed to fetch messages",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Typing handler
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!socket || !selectedGroup) return;

    socket.emit("typing", {
      groupId: selectedGroup._id,
      user: {
        _id: currentUserId,
        username: currentUser.user?.username || currentUser.username,
      },
    });

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      socket.emit("stop typing", { groupId: selectedGroup._id });
    }, 2000);
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      // UPDATED axios → API
      const { data } = await API.post(`/api/messages`, {
        content: newMessage,
        groupId: selectedGroup._id,
      });

      setMessages((prev) => [...prev, data]);

      socket.emit("new message", { ...data, groupId: selectedGroup._id });

      setNewMessage("");
      setShowEmojiPicker(false);

      socket.emit("stop typing", { groupId: selectedGroup._id });
    } catch (error) {
      toast({
        title: "Error sending message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji.native);
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Flex h="100%" bg="purple.50" position="relative">
      {!selectedGroup ? (
        <Flex flex="1" align="center" justify="center" direction="column">
          <Icon as={FiMessageCircle} boxSize={12} color="purple.400" mb={3} />
          <Text fontSize="lg" color="purple.600" fontWeight="medium">
            Select or create a group to start chatting...
          </Text>
        </Flex>
      ) : (
        <>
          <Box flex="1" display="flex" flexDirection="column">
            {/* Header */}
            <Flex
              px={6}
              py={4}
              bg="purple.100"
              borderBottom="1px solid"
              borderColor="purple.200"
              align="center"
              justify="space-between"
              boxShadow="sm"
            >
              <Flex align="center">
                <Icon as={FiMessageCircle} fontSize="22px" color="purple.500" mr={3} />
                <Box>
                  <Text fontSize="lg" fontWeight="bold" color="purple.800">
                    {selectedGroup.name}
                  </Text>
                  <Text fontSize="sm" color="purple.600">
                    Group Chat
                  </Text>
                </Box>
              </Flex>

              <Button
                onClick={onOpen}
                colorScheme="purple"
                size="sm"
                leftIcon={<FiUsers />}
              >
                Members <Badge ml={2}>{connectedUsers.length}</Badge>
              </Button>
            </Flex>

            {/* Messages */}
            <VStack
              ref={messagesContainerRef}
              flex="1"
              overflowY="auto"
              spacing={4}
              align="stretch"
              px={6}
              py={4}
              pb={1}
            >
              {messages.length === 0 ? (
                <Text color="purple.500" textAlign="center">
                  No messages yet
                </Text>
              ) : (
                messages.map((message) => {
                  if (!message?.sender) return null;
                  const isOwn = message.sender._id === currentUserId;
                  return (
                    <Box
                      key={message._id}
                      alignSelf={isOwn ? "flex-end" : "flex-start"}
                      maxW="70%"
                    >
                      <Flex align="center" mb={1} gap={2}>
                        {!isOwn && <Avatar size="xs" name={message.sender.username} />}
                        <Text fontSize="xs" color="gray.500">
                          {isOwn ? "You" : message.sender.username}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          {formatTime(message.createdAt)}
                        </Text>
                      </Flex>

                      <Box
                        bg={isOwn ? "purple.500" : "white"}
                        color={isOwn ? "white" : "gray.800"}
                        p={3}
                        borderRadius="lg"
                        boxShadow="sm"
                      >
                        <Text>{message.content}</Text>
                      </Box>
                    </Box>
                  );
                })
              )}

              {typingUser && (
                <Flex align="center" pl={2}>
                  <Avatar size="xs" name={typingUser} mr={2} />
                  <Text fontSize="sm" color="purple.500">
                    {typingUser} is typing
                    <Box as="span" ml={1}>
                      <Box as="span" animation={`${blink} 1s infinite`} mr="2px">.</Box>
                      <Box
                        as="span"
                        animation={`${blink} 1s infinite`}
                        sx={{ animationDelay: "0.2s" }}
                        mr="2px"
                      >
                        .
                      </Box>
                      <Box
                        as="span"
                        animation={`${blink} 1s infinite`}
                        sx={{ animationDelay: "0.4s" }}
                      >
                        .
                      </Box>
                    </Box>
                  </Text>
                </Flex>
              )}
              <div ref={messagesEndRef} />
            </VStack>

            {/* Input Box */}
            <Box
              p={4}
              bg="white"
              borderTop="1px solid"
              borderColor="purple.200"
              position="sticky"
              bottom="0"
            >
              <InputGroup size="lg">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  pr="6rem"
                  bg="purple.50"
                  border="none"
                  _focus={{ boxShadow: "none", bg: "purple.100" }}
                />
                <InputRightElement width="6rem" display="flex" justifyContent="space-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    😀
                  </Button>
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="purple"
                    borderRadius="full"
                    onClick={sendMessage}
                  >
                    <Icon as={FiSend} />
                  </Button>
                </InputRightElement>
              </InputGroup>

              {showEmojiPicker && (
                <Box position="absolute" bottom="60px" right="10px" zIndex="10">
                  <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
                </Box>
              )}
            </Box>
          </Box>

          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px" color="purple.700">
                Group Members ({connectedUsers.length})
              </DrawerHeader>
              <DrawerBody>
                <UsersList
                  users={selectedGroup.members || []}
                  connectedUsers={connectedUsers}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </Flex>
  );
};

export default ChatArea;

