import { create } from 'zustand';

interface AuthState {
  user: any | null;
  loading: boolean;
  setUser: (user: any | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  clearUser: () => set({ user: null, loading: false }),
}));
