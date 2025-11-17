

import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import io from "socket.io-client";

const ENDPOINT = "https://chatly-8w8p.onrender.com";

const Chat = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token = stored?.token;
    const user = stored?.user;

    if (!token || !user) {
      console.warn("No user or token found — redirecting...");
      window.location.href = "/login";
      return;
    }

    const newSocket = io(ENDPOINT, {
      transports: ["websocket"],
      auth: { token, user },
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <Flex h="100vh">
      <Box w="300px" borderRight="1px solid" borderColor="gray.200">
        <Sidebar setSelectedGroup={setSelectedGroup} />
      </Box>

      <Box flex="1">
        {socket && <ChatArea selectedGroup={selectedGroup} socket={socket} />}
      </Box>
    </Flex>
  );
};

export default Chat;





