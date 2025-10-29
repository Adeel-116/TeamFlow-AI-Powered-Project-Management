
const {createServer} = require('http')
const {Server} = require('socket.io')

const PORT = 3001
const httpServer  = createServer();

const io = new Server(httpServer, {
    cors:{
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
})

const connectedUser = new Map()

io.on("connection", (socket)=>{
    console.log("client connect", socket.id)

    socket.on("register", (userId)=>{
        connectedUser.set(userId, socket.id)
        console.log(`✅ User ${userId} registered as ${socket.id}`);
    })

    socket.on("send_message", (data)=>{
        const {senderId, receiverId, message} = data
        console.log("Private Data", data)
        
        const recieverSocketId = connectedUser.get(receiverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit("receive_message", data)
        } 
    } )



socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);

    for (const [id, sid] of connectedUser.entries()) {
        if (sid === socket.id) {
          connectedUser.delete(id);
          break;
        }
      }

  });
})

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket server running on port ${PORT}`);
});