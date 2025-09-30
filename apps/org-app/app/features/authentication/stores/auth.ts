import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  userInfo: Record<string, any> | null;
  setAccessToken: (token: string | null) => void;
  setUserInfo: (info: Record<string, any> | null) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userInfo: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setUserInfo: (info) => set({ userInfo: info }),
      clearAuth: () => set({ accessToken: null, userInfo: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useAuthStore;