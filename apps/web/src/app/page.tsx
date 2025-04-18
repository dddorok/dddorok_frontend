"use client";

import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";

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
import { userTestLogin } from "@/services/user";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <TestLogin />
      <br />
      <NaverLogin />
      <GoogleLogin />
      <KakaoLogin />
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

function TestLogin() {
  const [test, setTest] = useState(false);

  const checkTestLogin = async () => {
    const res = await userTestLogin();
    console.log("res: ", res);
    setTest(res.ok);
  };

  return (
    <div>
      TestLogin Status: {test ? "Success" : "Failed"}
      <Button onClick={checkTestLogin}>Re Check</Button>
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

function KakaoLogin() {
  const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID; // 발급받은 클라이언트 아이디
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}?provider=kakao`; // Callback URL

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}
`;

  const login = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return <button onClick={login}>카카오 로그인</button>;
}

function GoogleLogin() {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // 발급받은 클라이언트 아이디
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}?provider=google`; // Callback URL

  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?
		client_id=${GOOGLE_CLIENT_ID}
		&redirect_uri=${REDIRECT_URI}
		&response_type=code
		&scope=email profile`;

  const login = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return <button onClick={login}>구글 로그인</button>;
}
