import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAccountStore = create(
  persist(
    (set) => ({
      token: null,
      setToken: (newToken) => set({ token: newToken }),
      logOut: () => set({ token: null }),
    }),
    {
      name: "account-storage", // localStorage key
      getStorage: () => localStorage, // optional, defaults to localStorage
    }
  )
);
export default useAccountStore;
