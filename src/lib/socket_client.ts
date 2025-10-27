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
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io('http://localhost:3001', { // Changed to port 3001 to match server
    auth: {
      token,
    },
    autoConnect: true,
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

export const getSocket = (): Socket => {
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
export const sendMessage = (data: {
  conversationId: string;
  recipientId: string;
  content: string;
}) => {
  const socketInstance = getSocket();
  socketInstance.emit('send_message', data);
};

export const startTyping = (recipientId: string, conversationId: string) => {
  const socketInstance = getSocket();
  socketInstance.emit('typing_start', { recipientId, conversationId });
};

export const stopTyping = (recipientId: string, conversationId: string) => {
  const socketInstance = getSocket();
  socketInstance.emit('typing_stop', { recipientId, conversationId });
};

export const markMessagesAsRead = (conversationId: string, messageIds: string[]) => {
  const socketInstance = getSocket();
  socketInstance.emit('mark_read', { conversationId, messageIds });
};