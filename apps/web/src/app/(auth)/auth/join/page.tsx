"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LoginForm } from "../_components/LoginForm";

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
          // setUrl(url);
          window.location.href = url;
        }}
      />
      <p className=" text-[14px] text-neutral-N600 text-center">
        이미 회원이신가요?{" "}
        <Link href={ROUTE.LOGIN} className="text-primary-PR ">
          로그인
        </Link>
      </p>
    </>
  );
}
