import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LoginButton } from "./LoginButton";

import { login } from "@/services/auth";

export const dynamic = "force-dynamic";

export default async function OAuthRedirect(props: {
  searchParams: Promise<{ provider: string; code: string; state: string }>;
}) {
  try {
    const searchParams = await props.searchParams;

    switch (searchParams.provider) {
      case "naver":
      case "kakao":
      case "google": {
        return (
          <Suspense>
            <LoginButton
            // accessToken={data.access_token}
            // refreshToken={data.refresh_token}
            />
          </Suspense>
        );
      }

      default:
        throw new Error("Invalid provider");
    }
  } catch (error) {
    console.error(error);
  }

  // redirect("/");
}
