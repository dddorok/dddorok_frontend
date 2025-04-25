import { ClientProvider } from "./provider";

import type { Metadata } from "next";

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
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
