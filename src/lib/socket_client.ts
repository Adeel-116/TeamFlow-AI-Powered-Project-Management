import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io('http://localhost:3000', {
    auth: {
      token,
    },
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket!.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error: Error) => {
    console.error('Socket connection error:', error);
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
  id: string;
  conversationId: string;
  recipientId: string;
  content: string;
}) => {
  const socketInstance = getSocket();
  socketInstance.emit('send-message', data); // match server event name
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
