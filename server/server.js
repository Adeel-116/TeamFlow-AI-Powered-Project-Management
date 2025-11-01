const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = 3001;
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

const connectedUser = new Map();
const onlineUsers = new Map(); // Track status

io.on("connection", (socket) => {

  // Register user
  socket.on("register", (userId) => {
    connectedUser.set(userId, socket.id);
    console.log("User connected:", userId);
    const status = true;
    onlineUsers.set(userId, status);
    const onlineArray = Array.from(onlineUsers.entries()).map(([userId, status]) => ({userId: userId, status}));
    io.emit("user_status", onlineArray);
  });

  socket.on("send_message", (data) => {
    const { senderId, receiverId, message } = data;
    const receiverSocketID = connectedUser.get(receiverId);

    if (receiverSocketID) {
      io.to(receiverSocketID).emit("receive_message", data);
    } else {
      console.log("⚠️ Receiver not connected:", receiverId);
    }
  });

  socket.on("messages_read", (data) => {
    const { senderId, receiverId } = data;
    const senderSocketID = connectedUser.get(senderId);

    if (senderSocketID) {
      io.to(senderSocketID).emit("messages_read_ack", {
        senderId,
        receiverId,
        timestamp: new Date().toISOString(),
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);

    for (const [userId, socketId] of connectedUser.entries()) {
      if (socketId === socket.id) {
        connectedUser.delete(userId);
        onlineUsers.set(userId, false);
        const onlineArray = Array.from(onlineUsers.entries()).map(([userId, status]) => ({userId: userId, status}));
        io.emit("user_status", onlineArray);
        console.log(`🗑️ User ${userId} is now offline`);
        break;
      }
    }

    console.log(`📊 Total connected users: ${connectedUser.size}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket server running on port ${PORT}`);
});