"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center h-screen bg-neutral-N0">
      <Header />
      <div className="mt-[112px] mb-20 flex-1 mx-8 border border-neutral-N200 bg-neutral-N0 p-4 px-10 space-y-8 pt-11 pb-8">
        {children}
      </div>
      <Footer />
    </div>
  );
}
