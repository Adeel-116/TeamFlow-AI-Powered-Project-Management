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

    socket.on("register", (userId) => {
        connectedUser.set(userId, socket.id)
        console.log(`✅ User ${userId} registered as ${socket.id}`);
        console.log(`📊 Total connected users: ${connectedUser.size}`);
    })

    socket.on("send_message", (data) => {
        const { senderId, receiverId, message } = data;
        console.log("📤 Private Data:", data);
        console.log("👥 Connected users:", Array.from(connectedUser.entries()));

        const receiverSocketID = connectedUser.get(receiverId);
        if (receiverSocketID) {
            io.to(receiverSocketID).emit("receive_message", data);
            console.log("✅ Message sent to:", receiverSocketID);
        } else {
            console.log("⚠️ Receiver not connected:", receiverId);
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