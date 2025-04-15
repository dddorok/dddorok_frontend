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
      <NaverLogin />
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

function NaverLogin() {
  const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID; // 발급받은 클라이언트 아이디
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}?provider=naver`; // Callback URL

  const STATE = "flase";
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;

  const login = () => {
    window.location.href = NAVER_AUTH_URL;
  };

  return <button onClick={login}>네이버 로그인</button>;
}
