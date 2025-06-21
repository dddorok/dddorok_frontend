"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { createTestSession, updateSession } from "@/lib/auth";
import { getMeasurementRules } from "@/services/measurement-rule";
import { userTestLogin } from "@/services/user";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">로그인</CardTitle>
          <CardDescription className="text-center">
            서비스를 이용하기 위해 로그인해주세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NaverLogin />
        </CardContent>
      </Card>
    </div>
  );
}

function NaverLogin() {
  const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}?provider=naver`;
  const STATE = "flase";
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;

  const login = () => {
    window.location.href = NAVER_AUTH_URL;
  };

  return (
    <Button
      onClick={login}
      className="w-full bg-[#03C75A] hover:bg-[#02b351] text-white"
    >
      네이버 로그인
    </Button>
  );
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

function TestLogin() {
  const [test, setTest] = useState(false);

  const checkTestLogin = async () => {
    try {
      await getMeasurementRules();
      setTest(true);
    } catch (error) {
      console.log("error: ", error);
      setTest(false);
    }
  };

  return (
    <div>
      TestLogin Status: {test ? "Success" : "Failed"}
      <Button onClick={checkTestLogin}>Re Check</Button>
    </div>
  );
}
