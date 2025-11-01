import { create } from 'zustand';

interface ChatUser {
  uuid_id: string;
  name: string;
  email: string;
  role: string;
}

interface ChatState {
  currentUser: ChatUser | null;
  selectedUser: ChatUser | null;
  setCurrentUser: (user: ChatUser) => void;
  setSelectedUser: (user: ChatUser) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentUser: null,
  selectedUser: null,
  setCurrentUser: (user) => {
    console.log("🎯 Zustand setCurrentUser called:", user);
    set({ currentUser: user });
  },
  setSelectedUser: (user) => {
    console.log("🎯 Zustand setSelectedUser called:", user);
    set({ selectedUser: user });
  },
}));
