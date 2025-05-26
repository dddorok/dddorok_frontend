/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowLeft, ArrowRight, XIcon } from "lucide-react";
import { use, useEffect, useState } from "react";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createTestSession, updateSession } from "@/lib/auth";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen bg-neutral-N100">
      <Header />
      <div className="my-[112px] mx-8 rounded-2xl border border-neutral-N100 bg-neutral-N0 shadow-[0px_4px_16px_0px_rgba(28,31,37,0.03)] p-4 px-10 space-y-8 pt-[44px] pb-8">
        <h1 className="text-h2 text-neutral-N900 text-center">Log in</h1>
        <div className="flex flex-col gap-4">
          <NaverLogin />
          <GoogleLogin />
          <KakaoLogin />
        </div>
      </div>
      {/* <RefreshToken />
      <TestSession /> */}
    </div>
  );
}

function TermsDialog({
  onAgree,
  children,
}: {
  onAgree: () => void;
  children: React.ReactNode;
}) {
  const [checks, setChecks] = useState({
    terms: false,
    privacy: false,
    all: false,
  });

  useEffect(() => {
    if (checks.terms && checks.privacy) {
      if (!checks.all) setChecks((prev) => ({ ...prev, all: true }));
    } else {
      if (checks.all) setChecks((prev) => ({ ...prev, all: false }));
    }
  }, [checks.terms, checks.privacy]);

  const handleCheckedChange = (
    key: keyof typeof checks,
    checked: boolean | string
  ) => {
    setChecks({ ...checks, [key]: checked });
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>뜨도록 이용약관</DialogTitle>
          <DialogDescription>뜨도록 이용약관 </DialogDescription>
        </DialogHeader>
        <div className="space-y-1">
          <CheckboxWithLabel
            id="all"
            checked={checks.all}
            onCheckedChange={(checked: boolean) => {
              setChecks({
                ...checks,
                all: checked,
                terms: checked,
                privacy: checked,
              });
            }}
            label={
              <div className="font-semibold">다음 모든 항목에 동의합니다.</div>
            }
          />
          <CheckboxWithLabel
            id="terms"
            checked={checks.terms}
            onCheckedChange={(checked) => handleCheckedChange("terms", checked)}
            label={
              <>
                (필수) <strong className="font-[400]">이용약관</strong>에
                동의합니다.
              </>
            }
          />
          <CheckboxWithLabel
            id="privacy"
            checked={checks.privacy}
            onCheckedChange={(checked) =>
              handleCheckedChange("privacy", checked)
            }
            label={
              <>
                (필수){" "}
                <strong className="font-[400]">개인정보 수집 및 사용</strong>에
                동의합니다.
              </>
            }
          />
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            color="fill"
            disabled={!checks.privacy || !checks.terms}
            onClick={onAgree}
          >
            동의하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

  return (
    <>
      <TermsDialog
        onAgree={() => {
          login();
        }}
      >
        <LoginButton
          // onLogin={login}
          imageSrc="/images/login/naver.svg"
          text="네이버로 가입하기"
        />
      </TermsDialog>
    </>
  );
}

function LoginButton({
  // onLogin,
  imageSrc,
  text,
}: {
  // onLogin: () => void;
  imageSrc: string;
  text: string;
}) {
  return (
    <div className="rounded-md border border-neutral-N300 bg-neutral-N0 backdrop-blur-[12px] flex w-[300px] px-4 py-2 justify-center items-center">
      <img src={imageSrc} alt={`${text}-logo`} width={32} height={32} />
      <p className="flex-1 text-medium-sb text-neutral-N900">{text}</p>
    </div>
  );
}

function KakaoLogin() {
  const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID; // 발급받은 클라이언트 아이디
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}?provider=kakao`; // Callback URL

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}
`;

  const login = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <TermsDialog
      onAgree={() => {
        login();
      }}
    >
      <LoginButton
        // onLogin={login}
        imageSrc="/images/login/kakao.png"
        text="카카오로 가입하기"
      />
    </TermsDialog>
  );
  // return <button onClick={login}>카카오 로그인</button>;
}

function GoogleLogin() {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // 발급받은 클라이언트 아이디
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI}?provider=google`; // Callback URL
  console.log("REDIRECT_URI: ", REDIRECT_URI);

  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?
		client_id=${GOOGLE_CLIENT_ID}
		&redirect_uri=${REDIRECT_URI}
		&response_type=code
		&scope=email profile`;

  const login = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <TermsDialog
      onAgree={() => {
        login();
      }}
    >
      <LoginButton
        // onLogin={login}
        imageSrc="/images/login/google.png"
        text="구글로 가입하기"
      />
    </TermsDialog>
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
