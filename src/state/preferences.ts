import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemePreference = "system" | "light" | "dark";
export type MotionPreference = "system" | "reduce" | "full";

interface PreferencesState {
  theme: ThemePreference;
  motion: MotionPreference;
  setTheme: (theme: ThemePreference) => void;
  setMotion: (motion: MotionPreference) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "system",
      motion: "system",
      setTheme: (theme) => set({ theme }),
      setMotion: (motion) => set({ motion }),
    }),
    {
      name: "preferences",
      version: 1,
      partialize: ({ theme, motion }) => ({ theme, motion }),
    },
  ),
);
