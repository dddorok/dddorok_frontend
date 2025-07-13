"use client";
import { OverlayProvider } from "overlay-kit";
import { Toaster } from "sonner";

import DebugFloatingButton from "./common/DebugFloatingButton";
import { TooltipProvider } from "./ui/tooltip";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" />
      <OverlayProvider>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </OverlayProvider>
      <DebugFloatingButton />
    </>
  );
}
