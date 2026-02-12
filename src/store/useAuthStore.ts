import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: localStorage.getItem(STORAGE_KEYS.USER) 
    ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)!) 
    : null,
  token: localStorage.getItem(STORAGE_KEYS.TOKEN),
  login: (user, token) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    set({ user: null, token: null });
  },
  isAuthenticated: () => !!get().token,
}));
