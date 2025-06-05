"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { createSession } from "@/lib/auth";
import { login, LoginProvider } from "@/services/auth";

export function LoginButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onLogin = async () => {
    try {
      const data = await login({
        provider: searchParams.get("provider") as LoginProvider,
        code: searchParams.get("code") as string,
        state: searchParams.get("state") as string,
      });

      await createSession({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });

      console.log("redirecting to /");
      router.replace("/");
    } catch (error) {
      console.log("error: ", error);
    } finally {
      router.push("/");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onLogin();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen bg-neutral-N0">
      <div className="space-y-6">
        <p className="text-small text-neutral-N400 text-center ">
          로그인 중<br />
          <br />
          잠시만 기다려주세요.
        </p>
        <Image src="/assets/logo/gray.svg" width={200} height={80} alt="" />
      </div>
      <footer className="py-9 text-small text-neutral-N500 text-center">
        ©2025 DDDOROK • All rights reserved.
      </footer>
    </div>
  );
}
