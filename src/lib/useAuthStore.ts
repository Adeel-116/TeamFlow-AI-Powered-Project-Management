import {create } from 'zustand'

type User = {
  id: string;
  name: string;
  email: string;
  role: "manager" | "team_member";
} | null;

type AuthStore = {
    user: User;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));