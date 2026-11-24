import { create } from "zustand";

interface HireMeState {
  open: boolean;
  show: () => void;
  hide: () => void;
}

// Whether the Hire Me form is open. Every Hire me button opens the same form.
export const useHireMe = create<HireMeState>()((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
