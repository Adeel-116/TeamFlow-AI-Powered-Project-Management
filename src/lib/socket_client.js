// import io from 'socket.io-client';
// import  { Socket } from 'socket.io-client';


// export const initializeSocket = (token) => {
//   if (socket && socket.connected) {
//     return socket;
//   }

//   socket = io('http://localhost:3000', {
//     auth: {
//       token,
//     },
//     autoConnect: true,
//   });

//   socket.on('connect', () => {
//     console.log('Socket connected:', socket.id);
//   });

//   socket.on('disconnect', () => {
//     console.log('Socket disconnected');
//   });

//   socket.on('connect_error', (error) => {
//     console.error('Socket connection error:', error);
//   });

//   return socket;
// };

// export const getSocket = () => {
//   if (!socket) {
//     throw new Error('Socket not initialized. Call initializeSocket first.');
//   }
//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };

// // Helper functions for socket operations
// export const sendMessage = (data) => {
//   const socketInstance = getSocket();
//   socketInstance.emit('send-message', data); // match server event name
// };

// export const startTyping = (recipientId, conversationId) => {
//   const socketInstance = getSocket();
//   socketInstance.emit('typing_start', { recipientId, conversationId });
// };

// export const stopTyping = (recipientId, conversationId) => {
//   const socketInstance = getSocket();
//   socketInstance.emit('typing_stop', { recipientId, conversationId });
// };

// export const markMessagesAsRead = (conversationId, messageIds) => {
//   const socketInstance = getSocket();
//   socketInstance.emit('mark_read', { conversationId, messageIds });
// };



// lib/socket.ts
// 




// lib/socket_client.js
import io from 'socket.io-client';

let socket = null;

export const initializeSocket = (token) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io('http://localhost:3000', {
    auth: {
      token,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('🔴 Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Helper functions for socket operations
export const sendMessage = (data) => {
  const socketInstance = getSocket();
  socketInstance.emit('send_message', data);
};

export const startTyping = (recipientId, conversationId) => {
  const socketInstance = getSocket();
  socketInstance.emit('typing_start', { recipientId, conversationId });
};

export const stopTyping = (recipientId, conversationId) => {
  const socketInstance = getSocket();
  socketInstance.emit('typing_stop', { recipientId, conversationId });
};

export const markMessagesAsRead = (conversationId, messageIds) => {
  const socketInstance = getSocket();
  socketInstance.emit('mark_read', { conversationId, messageIds });
};