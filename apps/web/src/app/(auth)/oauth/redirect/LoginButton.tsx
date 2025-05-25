"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <h1 className="text-2xl font-bold">로그인 성공</h1>
      <Button variant="outline" onClick={onLogin}>
        홈으로 이동
      </Button>
    </div>
  );
}
