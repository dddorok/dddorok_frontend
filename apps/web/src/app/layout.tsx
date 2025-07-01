import type { Metadata } from "next";

import { ClientProvider } from "@/components/ClientProvider";
import { QueryProvider } from "@/lib/react-query";

import "./globals.css";

export const metadata: Metadata = {
  title: "DDDOROK",
  description: "DDDOROK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <QueryProvider>{children}</QueryProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
