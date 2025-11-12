import { VStack, HStack, Avatar, Text, Badge } from "@chakra-ui/react";

const UsersList = ({ users = [], connectedUsers = [] }) => {
  
  const onlineUserIds = connectedUsers.map((u) => u._id);

  return (
    <VStack spacing={4} align="stretch">
      {users.length === 0 ? (
        <Text color="gray.500" textAlign="center">
          No members in this group yet
        </Text>
      ) : (
        users.map((user) => {
          const isOnline = onlineUserIds.includes(user._id);

          return (
            <HStack
              key={user._id}
              justify="space-between"
              p={3}
              borderWidth="1px"
              borderRadius="lg"
              bg="purple.50"
              _hover={{ bg: "purple.100" }}
            >
              <HStack>
                <Avatar
                  name={user.username}
                  size="sm"
                  bg={isOnline ? "green.400" : "purple.400"}
                  color="white"
                />
                <Text fontWeight="medium" color="purple.800">
                  {user.username}
                </Text>
              </HStack>

              <Badge
                colorScheme={isOnline ? "green" : "gray"}
                variant="subtle"
                borderRadius="full"
                px={3}
                py={1}
              >
                {isOnline ? "ONLINE" : "OFFLINE"}
              </Badge>
            </HStack>
          );
        })
      )}
    </VStack>
  );
};

export default UsersList;







