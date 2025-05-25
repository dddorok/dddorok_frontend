"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createSession } from "@/lib/auth";

export function LoginButton({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const router = useRouter();

  const onLogin = async () => {
    console.log("accessToken, refreshToken: ", accessToken, refreshToken);
    await createSession({ accessToken, refreshToken });
    router.push("/");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onLogin();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
      <div className="space-y-6">
        <p className="text-small text-neutral-N400 text-center ">
          로그인 중<br />
          <br />
          잠시만 기다려주세요.
        </p>
        <img src="/logo/logo-gray.svg" width={200} height={80} alt="" />
      </div>
    </div>
  );
}
