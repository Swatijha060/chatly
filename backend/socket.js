
const setupSocket = (io) => {
  const users = new Map(); // userId -> socketId
  const userRooms = new Map(); // socketId -> roomId

  io.on("connection", (socket) => {
    console.log(" New socket connected:", socket.id);

    socket.on("register user", (user) => {
      if (user && user._id) {
        users.set(user._id, socket.id);
        console.log(`Registered user: ${user.username} (${user._id})`);
      }
    });

    socket.on("join room", (roomId) => {
      socket.join(roomId);
      userRooms.set(socket.id, roomId);

      const roomUsers = [];
      for (const [userId, userSocketId] of users.entries()) {
        const s = io.sockets.sockets.get(userSocketId);
        if (s && s.rooms.has(roomId)) {
          roomUsers.push({ _id: userId });
        }
      }

      io.to(roomId).emit("room users", roomUsers);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on("leave room", (roomId) => {
      socket.leave(roomId);
      userRooms.delete(socket.id);

      const roomUsers = [];
      for (const [userId, userSocketId] of users.entries()) {
        const s = io.sockets.sockets.get(userSocketId);
        if (s && s.rooms.has(roomId)) {
          roomUsers.push({ _id: userId });
        }
      }

      io.to(roomId).emit("room users", roomUsers);
      console.log(`User left room: ${roomId}`);
    });

    
    socket.on("new message", (message) => {
      const roomId = message.groupId;
      if (!roomId) return;
      socket.to(roomId).emit("message received", message);
      console.log(`Message broadcasted to room ${roomId} (except sender)`);
    });

    socket.on("typing", ({ groupId, user }) => {
      socket.to(groupId).emit("user typing", user);
    });

    socket.on("stop typing", ({ groupId }) => {
      socket.to(groupId).emit("user stop typing");
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);

      for (const [userId, userSocketId] of users.entries()) {
        if (userSocketId === socket.id) {
          users.delete(userId);
          break;
        }
      }

      const roomId = userRooms.get(socket.id);
      if (roomId) {
        userRooms.delete(socket.id);

        const roomUsers = [];
        for (const [userId, userSocketId] of users.entries()) {
          const s = io.sockets.sockets.get(userSocketId);
          if (s && s.rooms.has(roomId)) {
            roomUsers.push({ _id: userId });
          }
        }

        io.to(roomId).emit("room users", roomUsers);
      }
    });
  });
};

module.exports = setupSocket;

