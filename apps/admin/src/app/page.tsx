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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Button onClick={() => onLogin("naver")}>Naver</Button>
      <Button onClick={() => onLogin("google")}>Google</Button>
      <Button onClick={() => onLogin("kakao")}>Kakao</Button>
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
