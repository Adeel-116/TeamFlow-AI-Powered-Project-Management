import { create } from "zustand";

interface ChatUser {
  uuid_id: string;
  name: string;
  email: string;
  role: string;
}

interface ChatState {
  currentUser: ChatUser | null;
  selectedUser: ChatUser | null;
  onlineUsers: Record<string, boolean>;
  setCurrentUser: (user: ChatUser) => void;
  setSelectedUser: (user: ChatUser) => void;
  setOnlineUsers: (users: Record<string, boolean>) => void;
  updateOnlineStatus: (userId: string, isOnline: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentUser: null,
  selectedUser: null,
  onlineUsers: {},

  setCurrentUser: (user) => {
    console.log("🎯 Zustand → setCurrentUser called:", user);
    set({ currentUser: user });
  },

  setSelectedUser: (user) => {
    console.log("🎯 Zustand → setSelectedUser called:", user);
    set({ selectedUser: user });
  },

  setOnlineUsers: (users) => {
    console.log("📡 Zustand → setOnlineUsers called:", users);
    set({ onlineUsers: users });
  },

  updateOnlineStatus: (userId, isOnline) => {
    const prevOnlineUsers = get().onlineUsers;
    const updated = { ...prevOnlineUsers, [userId]: isOnline };

    console.log(
      `🟢 Zustand → updateOnlineStatus called for ${userId}:`,
      isOnline
    );
    console.log("🧩 Updated onlineUsers state:", updated);
    set({ onlineUsers: updated });
  },
}));
