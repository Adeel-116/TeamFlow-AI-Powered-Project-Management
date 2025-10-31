// @/lib/chat_id.ts should look something like:
import { create } from 'zustand';

interface ChatIDState {
  currentUserID: string | null;
  selectedUserID: string | null;
  setCurrentID: (id: string) => void;
  setSelectedID: (id: string) => void;
}

export const useChatID = create<ChatIDState>((set) => ({
  currentUserID: null,
  selectedUserID: null,
  setCurrentID: (id) => {
    console.log("🎯 Zustand setCurrentID called:", id);
    set({ currentUserID: id });
  },
  setSelectedID: (id) => {
    console.log("🎯 Zustand setSelectedID called:", id);
    set({ selectedUserID: id });
  },
}));