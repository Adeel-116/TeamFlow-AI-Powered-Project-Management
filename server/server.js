const { createServer } = require('http')
const { Server } = require('socket.io')
const PORT = 3001
const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
})

const connectedUser = new Map()

io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    socket.on("register", (userId) => {
        connectedUser.set(userId, socket.id)
        console.log(`✅ User ${userId} registered as ${socket.id}`);
        console.log(`📊 Total connected users: ${connectedUser.size}`);
    })

    socket.on("send_message", (data) => {
        const { senderId, receiverId, message } = data;
        const receiverSocketID = connectedUser.get(receiverId);
        
        if (receiverSocketID) {
            console.log(`📤 Sending message from ${senderId} to ${receiverId}`);
            io.to(receiverSocketID).emit("receive_message", data);
        } else {
            console.log("⚠️ Receiver not connected:", receiverId);
        }
    });

    // Handle when user reads messages
    socket.on("messages_read", (data) => {   
        const { senderId, receiverId } = data;
        console.log(`📖 Messages read by ${receiverId} from ${senderId}`);
        
        const senderSocketID = connectedUser.get(senderId);
        
        if (senderSocketID) {
            // Notify the sender that their messages have been read
            io.to(senderSocketID).emit("messages_read_ack", {
                senderId,
                receiverId,
                timestamp: new Date().toISOString(),
            });
            console.log(`✅ Sent read receipt to ${senderId}`);
        } else {
            console.log("⚠️ Sender not connected:", senderId);
        }
    });

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
        
        for (const [userId, socketId] of connectedUser.entries()) {
            if (socketId === socket.id) {
                connectedUser.delete(userId);
                console.log(`🗑️ Removed user ${userId} from connected users`);
                break;
            }
        }
        console.log(`📊 Total connected users: ${connectedUser.size}`);
    });
})

httpServer.listen(PORT, () => {
    console.log(`🚀 Socket server running on port ${PORT}`);
});