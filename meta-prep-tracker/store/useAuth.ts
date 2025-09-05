'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: number;
  name: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  login: (userId: number, password: string) => boolean;
  logout: () => void;
  updateName: (name: string) => void;
};

// Hardcoded demo users
const DEMO_USERS = {
  1: { id: 1, name: 'Demo User 1' },
  2: { id: 2, name: 'Demo User 2' },
  3: { id: 3, name: 'Demo User 3' },
  4: { id: 4, name: 'Demo User 4' },
  5: { id: 5, name: 'Demo User 5' },
  6: { id: 6, name: 'Demo User 6' },
  7: { id: 7, name: 'Demo User 7' },
  8: { id: 8, name: 'Demo User 8' },
  9: { id: 9, name: 'Demo User 9' },
} as const;

const DEMO_PASSWORD = '363636';

export const useAuth = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (userId: number, password: string) => {
        if (password !== DEMO_PASSWORD || !DEMO_USERS[userId as keyof typeof DEMO_USERS]) {
          return false;
        }

        const user = DEMO_USERS[userId as keyof typeof DEMO_USERS];
        set({ user, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateName: (name: string) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, name } });
        }
      },
    }),
    { name: 'auth-demo' }
  )
);
