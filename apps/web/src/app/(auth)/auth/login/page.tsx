"use client";

import { LoginForm } from "../_components/LoginForm";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen bg-neutral-N0">
      <Header />
      <div className="mt-[112px] mb-20 flex-1 mx-8 border border-neutral-N200 bg-neutral-N0 p-4 px-10 space-y-8 pt-11 pb-8">
        <h1 className="text-h2 text-neutral-N900 text-center">Log in</h1>
        <LoginForm type="login" />
      </div>
      <Footer />
    </div>
  );
}
