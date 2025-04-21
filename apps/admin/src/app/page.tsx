"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { login, LoginProvider } from "@/services/auth";

export default function Home() {
  const onLogin = async (provider: LoginProvider) => {
    const response = await login(provider);
    console.log("response: ", response);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen"></div>
  );
}
