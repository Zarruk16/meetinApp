import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: string;
  image?: string;
};

const TOKEN_KEY = "bm_auth_token";

type AuthState = {
  token: string | null;
  user: UserProfile | null;
  hydrated: boolean;
  setSession: (token: string, user: UserProfile) => Promise<void>;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  setSession: async (token, user) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    set({ token, user });
  },
  clearSession: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null, user: null });
  },
  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      set({ token, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
}));

export function getAuthToken() {
  return useAuthStore.getState().token;
}
