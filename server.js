const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
// const pool = require('pg');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;

// const app = next({ dev, hostname, port });
// const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const connectedUsers = new Map(); // userId -> socketId

  // Socket authentication
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.userId = decoded.uuid_id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);

    connectedUsers.set(socket.userId, socket.id);
    socket.join(socket.userId);

    // Update online status in DB
    // try {
    //   await pool.query(
    //     'UPDATE team_members SET is_online = true, last_seen = NOW() WHERE uuid_id = $1',
    //     [socket.userId]
    //   );
    // } catch (err) {
    //   console.error('Error updating online status:', err);
    // }

    io.emit('user_status', { userId: socket.userId, isOnline: true });

    // Send message
    socket.on('send_message', async (data) => {
      const { conversationId, recipientId, content } = data;
      try {
        // Save message to DB
        const result = await pool.query(
          `INSERT INTO messages (conversation_id, sender_id, content)
           VALUES ($1, $2, $3)
           RETURNING id, conversation_id as "conversationId", sender_id as "senderId",
                     content, is_read as "isRead", created_at as timestamp`,
          [conversationId, socket.userId, content]
        );

        const messagePayload = result.rows[0];

        // Send to recipient
        const recipientSocketId = connectedUsers.get(recipientId);
        if (recipientSocketId) io.to(recipientId).emit('receive_message', messagePayload);

        // Confirm to sender
        socket.emit('message_sent', { ...messagePayload, status: 'delivered' });
      } catch (err) {
        console.error('Error sending message:', err);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing_start', (data) => {
      const { recipientId, conversationId } = data;
      const recipientSocketId = connectedUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientId).emit('user_typing', { userId: socket.userId, conversationId, isTyping: true });
      }
    });

    socket.on('typing_stop', (data) => {
      const { recipientId, conversationId } = data;
      const recipientSocketId = connectedUsers.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientId).emit('user_typing', { userId: socket.userId, conversationId, isTyping: false });
      }
    });

    // Mark read
    // socket.on('mark_read', async (data) => {
    //   const { conversationId, messageIds } = data;
    //   try {
    //     // Update DB
    //     await pool.query('UPDATE messages SET is_read = true WHERE id = ANY($1)', [messageIds]);

    //     // Notify other participant
    //     const convResult = await pool.query(
    //       'SELECT user1_id, user2_id FROM conversations WHERE id = $1',
    //       [conversationId]
    //     );

    //     if (convResult.rows.length > 0) {
    //       const conv = convResult.rows[0];
    //       const otherUserId = conv.user1_id === socket.userId ? conv.user2_id : conv.user1_id;
    //       const otherSocketId = connectedUsers.get(otherUserId);
    //       if (otherSocketId) io.to(otherSocketId).emit('messages_read', { conversationId, messageIds });
    //     }
    //   } catch (err) {
    //     console.error('Error marking read:', err);
    //   }
    // });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      connectedUsers.delete(socket.userId);

    //   // Update offline in DB
    //   try {
    //     await pool.query('UPDATE team_members SET is_online = false, last_seen = NOW() WHERE uuid_id = $1', [socket.userId]);
    //   } catch (err) {
    //     console.error('Error updating offline status:', err);
    //   }

      io.emit('user_status', { userId: socket.userId, isOnline: false });
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
