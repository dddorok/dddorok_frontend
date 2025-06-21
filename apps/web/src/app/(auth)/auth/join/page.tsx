"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import { LoginForm } from "../_components/LoginForm";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ROUTE } from "@/constants/route";

export default function Home() {
  const [url, setUrl] = useState("");

  return (
    <>
      <h1 className="text-h2 text-neutral-N900 text-center">Log in</h1>
      <LoginForm
        type="join"
        onClick={(url) => {
          setUrl(url);
        }}
      />
      <p className=" text-[14px] text-neutral-N600 text-center">
        이미 회원이신가요?{" "}
        <Link href={ROUTE.LOGIN} className="text-primary-PR ">
          로그인
        </Link>
      </p>
      <TermsDialog
        open={url !== ""}
        onOpenChange={() => setUrl("")}
        onAgree={() => {
          window.location.href = url;
          setUrl("");
        }}
      />
    </>
  );
}

function TermsDialog({
  open,
  onOpenChange,
  onAgree,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree: () => void;
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
