"use client";
import { Toaster } from "sonner";

import DebugFloatingButton from "./common/DebugFloatingButton";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" />
      {children}
      <DebugFloatingButton />
    </>
  );
}
