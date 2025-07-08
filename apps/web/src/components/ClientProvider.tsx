"use client";
import { OverlayProvider } from "overlay-kit";
import { Toaster } from "sonner";

import DebugFloatingButton from "./common/DebugFloatingButton";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" />
      <OverlayProvider>{children}</OverlayProvider>
      <DebugFloatingButton />
    </>
  );
}
