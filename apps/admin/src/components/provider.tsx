"use client";
import { OverlayProvider } from "@toss/use-overlay";

import { QueryProvider } from "@/lib/react-query";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <OverlayProvider>{children}</OverlayProvider>
    </QueryProvider>
  );
}
