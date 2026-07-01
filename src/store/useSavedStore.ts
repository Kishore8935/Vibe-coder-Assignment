import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Platform } from "@/types";

export interface SavedProfile {
  user_id: string;
  username: string;
  fullname: string;
  picture: string;
  is_verified: boolean;
  followers: number;
  url: string;
  platform: Platform;
}

interface SavedListState {
  saved: SavedProfile[];
  addProfile: (profile: SavedProfile) => void;
  removeProfile: (userId: string) => void;
  clear: () => void;
}

export const useSavedStore = create<SavedListState>()(
  persist(
    (set, get) => ({
      saved: [],
      addProfile: (profile) => {
        const alreadySaved = get().saved.some(
          (p) => p.user_id === profile.user_id
        );
        if (alreadySaved) return;
        set((state) => ({ saved: [...state.saved, profile] }));
      },
      removeProfile: (userId) =>
        set((state) => ({
          saved: state.saved.filter((p) => p.user_id !== userId),
        })),
      clear: () => set({ saved: [] }),
    }),
    {
      name: "wobb:saved-list",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useIsProfileSaved(userId: string) {
  return useSavedStore((state) =>
    state.saved.some((p) => p.user_id === userId)
  );
}

export function useSavedCount() {
  return useSavedStore((state) => state.saved.length);
}
