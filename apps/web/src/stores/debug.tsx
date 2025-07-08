import { create } from "zustand";

interface DevStoreState {
  isDebug: boolean;
  setDebug: (value: boolean) => void;
}

export const useDevStore = create<DevStoreState>(
  (set: (partial: Partial<DevStoreState>) => void) => ({
    isDebug: false,
    setDebug: (value: boolean) => set({ isDebug: value }),
  })
);

export const useIsDebug = () => useDevStore((state) => state.isDebug);
