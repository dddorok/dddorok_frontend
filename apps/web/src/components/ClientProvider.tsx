"use client";
import { Toaster } from "sonner";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" />
      {children}
    </>
  );
}
