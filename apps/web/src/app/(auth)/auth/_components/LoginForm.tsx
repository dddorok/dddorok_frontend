import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createSession, createTestSession } from "@/lib/auth";
import { apiInstance } from "@/services/instance";

/* eslint-disable @next/next/no-img-element */
export function LoginForm(props: {
  onClick?: (url: string) => void;
  type: "join" | "login";
}) {
  return (
    <div className="flex flex-col gap-4">
      <LoginButton
        {...AUTH_PROVIDERS.NAVER}
        onClick={props.onClick}
        text={
          props.type === "join"
            ? AUTH_PROVIDERS.NAVER.joinText
            : AUTH_PROVIDERS.NAVER.loginText
        }
      />
      <LoginButton
        {...AUTH_PROVIDERS.GOOGLE}
        onClick={props.onClick}
        text={
          props.type === "join"
            ? AUTH_PROVIDERS.GOOGLE.joinText
            : AUTH_PROVIDERS.GOOGLE.loginText
        }
      />
      <LoginButton
        {...AUTH_PROVIDERS.KAKAO}
        onClick={props.onClick}
        text={
          props.type === "join"
            ? AUTH_PROVIDERS.KAKAO.joinText
            : AUTH_PROVIDERS.KAKAO.loginText
        }
      />
      <TestLoginButton />
    </div>
  );
}

function TestLoginButton() {
  const router = useRouter();
  const onLogin = async () => {
    const data = await apiInstance
      .get<{
        data: {
          access_token: string;
          refresh_token: string;
        };
      }>("auth/test-token")
      .json();

    console.log(data);

    // await createTestSession();
    await createSession({
      accessToken: data.data.access_token,
      refreshToken: data.data.refresh_token,
    });

    console.log("redirecting to /");
    router.replace("/");
  };
  if (process.env.NEXT_PUBLIC_ENV_MODE === "dev") {
    return <Button onClick={onLogin}>Test Login</Button>;
  }
  return null;
}

function LoginButton({
  imageSrc,
  text,
  authUrl,
  onClick,
}: {
  imageSrc: string;
  text: string;
  authUrl: string;
  onClick?: (url: string) => void;
}) {
  return (
    <button
      className="rounded-md border border-neutral-N300 bg-neutral-N0 backdrop-blur-[12px] flex w-[300px] px-4 py-2 justify-center items-center"
      onClick={() => {
        if (onClick) {
          onClick(authUrl);
        } else {
          window.location.href = authUrl;
        }
      }}
    >
      <img src={imageSrc} alt={`${text}-logo`} width={32} height={32} />
      <p className="flex-1 text-medium-sb text-neutral-N900">{text}</p>
    </button>
  );
}

const AUTH_PROVIDERS = {
  NAVER: {
    name: "네이버",
    imageSrc: "/images/login/naver.svg",
    joinText: "네이버로 가입하기",
    loginText: "네이버 로그인",
    authUrl: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}?provider=naver`,
  },
  GOOGLE: {
    name: "구글",
    imageSrc: "/images/login/google.png",
    joinText: "구글로 가입하기",
    loginText: "구글 로그인",
    authUrl: `https://accounts.google.com/o/oauth2/v2/auth?
            client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
            &redirect_uri=${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}?provider=google
            &response_type=code
            &scope=email profile`,
  },
  KAKAO: {
    name: "카카오",
    imageSrc: "/images/login/kakao.png",
    joinText: "카카오로 가입하기",
    loginText: "카카오 로그인",
    authUrl: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}?provider=kakao`,
  },
};
