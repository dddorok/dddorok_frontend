"use client";

import { LoginForm } from "../_components/LoginForm";

export default function Home() {
  return (
    <>
      <h1 className="text-h2 text-neutral-N900 text-center">Log in</h1>
      <LoginForm type="login" />
    </>
  );
}
