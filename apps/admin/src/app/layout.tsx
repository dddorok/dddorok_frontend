import type { Metadata } from "next";

import { QueryProvider } from "@/lib/react-query";

import "./globals.css";

export const metadata: Metadata = {
  title: "DDDOROK Admin",
  description: "DDDOROK Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
