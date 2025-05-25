import { redirect } from "next/navigation";

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
        const data = await login({
          provider: searchParams.provider,
          code: searchParams.code,
          state: searchParams.state,
        });

        console.log("000000000000000");
        console.log("data: ", data);
        return (
          <LoginButton
            accessToken={data.access_token}
            refreshToken={data.refresh_token}
          />
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
