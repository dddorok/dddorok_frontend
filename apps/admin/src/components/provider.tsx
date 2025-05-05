"use client";
import { OverlayProvider } from "@toss/use-overlay";

import { Toaster } from "./ui/toaster";

import { QueryProvider } from "@/lib/react-query";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <OverlayProvider>{children}</OverlayProvider>
      <Toaster />
    </QueryProvider>
  );
}
