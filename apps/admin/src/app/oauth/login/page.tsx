"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createTestSession, updateSession } from "@/lib/auth";
import { userTestLogin } from "@/services/user";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <TestLogin />
      <NaverLogin />
      <RefreshToken />
      <TestSession />
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

function RefreshToken() {
  const onRefreshToken = async () => {
    await updateSession();
  };

  return <button onClick={onRefreshToken}>Refresh Token</button>;
}

function TestSession() {
  const onTestSession = async () => {
    await createTestSession();
  };

  return <button onClick={onTestSession}>Test Session</button>;
}
