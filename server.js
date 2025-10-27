// 





const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Database pool
// Test database
if (!process.env.DATABASE_URL) {
  throw new Error("❌ Missing DATABASE_URL in environment variables");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log("server.js")
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log('🔄 Preparing Next.js...');

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('❌ Error handling request:', err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Socket.IO setup with proper CORS
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['*'],
    },
    transports: ['websocket', 'polling'],
  });

  const connectedUsers = new Map();

  // Middleware for authentication
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      console.log('🔐 Auth attempt:', { 
        hasToken: !!token,
        tokenLength: token?.length 
      });

      if (!token) {
        console.error('❌ No token provided');
        return next(new Error('Authentication error: No token'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.userId = decoded.uuid_id;
      socket.userName = decoded.name;
      socket.userEmail = decoded.email;
      
      console.log('✅ Auth successful:', socket.userName);
      next();
    } catch (err) {
      console.error('❌ JWT verification failed:', err.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`\n✅ User connected: ${socket.userName} (${socket.userId})`);
    console.log(`   Socket ID: ${socket.id}`);

    connectedUsers.set(socket.userId, socket.id);
    socket.join(socket.userId);

    // Update online status
    try {
      await pool.query(
        `INSERT INTO user_online_status (user_id, socket_id, connected_at, last_activity)
         VALUES ($1, $2, NOW(), NOW())
         ON CONFLICT (user_id) 
         DO UPDATE SET socket_id = $2, last_activity = NOW()`,
        [socket.userId, socket.id]
      );
      console.log('   📊 Online status updated');
    } catch (err) {
      console.error('   ❌ Error updating online status:', err.message);
    }

    // Broadcast online status
    socket.broadcast.emit('user_status', { 
      userId: socket.userId, 
      isOnline: true 
    });
    console.log('   📢 Broadcasted online status');

    // Send message event
    socket.on('send_message', async (data) => {
      const { conversationId, recipientId, content, tempId } = data;
      
      console.log(`\n📤 Send message:`, {
        from: socket.userName,
        to: recipientId,
        conversationId,
        contentLength: content?.length
      });

      try {
        // Verify conversation
        const convCheck = await pool.query(
          `SELECT * FROM conversations 
           WHERE id = $1 
           AND (user1_id = $2 OR user2_id = $2)`,
          [conversationId, socket.userId]
        );

        if (convCheck.rows.length === 0) {
          console.error('   ❌ Unauthorized conversation access');
          socket.emit('message_error', { 
            tempId,
            error: 'Unauthorized' 
          });
          return;
        }

        // Insert message
        const result = await pool.query(
          `INSERT INTO messages (conversation_id, sender_id, receiver_id, content, created_at)
           VALUES ($1, $2, $3, $4, NOW())
           RETURNING id, conversation_id as "conversationId", 
                     sender_id as "senderId", receiver_id as "receiverId",
                     content, is_read as "isRead", created_at as timestamp`,
          [conversationId, socket.userId, recipientId, content]
        );

        const messageData = result.rows[0];
        console.log('   ✅ Message saved, ID:', messageData.id);

        // Update conversation
        await pool.query(
          'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
          [conversationId]
        );

        // Send to recipient
        const recipientSocketId = connectedUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientId).emit('receive_message', {
            ...messageData,
            senderName: socket.userName
          });
          console.log('   📨 Sent to recipient');
        } else {
          console.log('   ⚠️ Recipient offline');
        }

        // Confirm to sender
        socket.emit('message_sent', {
          tempId,
          message: messageData,
          status: 'delivered'
        });
        console.log('   ✅ Confirmed to sender');

      } catch (err) {
        console.error('   ❌ Error:', err.message);
        socket.emit('message_error', { 
          tempId,
          error: 'Failed to send message' 
        });
      }
    });

    // Typing events
    socket.on('typing_start', (data) => {
      const { recipientId, conversationId } = data;
      if (connectedUsers.has(recipientId)) {
        io.to(recipientId).emit('user_typing', { 
          userId: socket.userId,
          userName: socket.userName,
          conversationId, 
          isTyping: true 
        });
        console.log(`⌨️ ${socket.userName} typing to ${recipientId}`);
      }
    });

    socket.on('typing_stop', (data) => {
      const { recipientId, conversationId } = data;
      if (connectedUsers.has(recipientId)) {
        io.to(recipientId).emit('user_typing', { 
          userId: socket.userId,
          userName: socket.userName,
          conversationId, 
          isTyping: false 
        });
      }
    });

    // Mark as read
    socket.on('mark_read', async (data) => {
      const { conversationId, messageIds } = data;
      
      console.log(`📖 Mark read:`, { user: socket.userName, count: messageIds.length });

      try {
        await pool.query(
          `UPDATE messages 
           SET is_read = true, read_at = NOW() 
           WHERE id = ANY($1) AND receiver_id = $2`,
          [messageIds, socket.userId]
        );

        const convResult = await pool.query(
          `SELECT user1_id, user2_id FROM conversations WHERE id = $1`,
          [conversationId]
        );

        if (convResult.rows.length > 0) {
          const conv = convResult.rows[0];
          const otherUserId = conv.user1_id === socket.userId 
            ? conv.user2_id 
            : conv.user1_id;
          
          if (connectedUsers.has(otherUserId)) {
            io.to(otherUserId).emit('messages_read', { 
              conversationId, 
              messageIds,
              readBy: socket.userId,
              readAt: new Date().toISOString()
            });
            console.log('   ✅ Read receipt sent');
          }
        }
      } catch (err) {
        console.error('   ❌ Error marking read:', err.message);
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`\n❌ User disconnected: ${socket.userName}`);
      
      connectedUsers.delete(socket.userId);

      try {
        await pool.query(
          'DELETE FROM user_online_status WHERE user_id = $1',
          [socket.userId]
        );
      } catch (err) {
        console.error('   ❌ Error updating offline:', err.message);
      }

      socket.broadcast.emit('user_status', { 
        userId: socket.userId, 
        isOnline: false,
        lastSeen: new Date().toISOString()
      });
    });
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 Server ready on http://${hostname}:${port}`);
    console.log(`🔌 Socket.IO ready on port ${port}`);
    console.log(`${'='.repeat(50)}\n`);
  });
}).catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});