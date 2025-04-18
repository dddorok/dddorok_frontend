import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";

import { createSession, updateSession } from "./auth";
import { decrypt } from "./jose";

export const verifySession = async () => {
  const sessionCookieName = "@dddorok/session";
  const cookie = await getCookie(sessionCookieName);

  if (!cookie) {
    redirect("/login");
  }
  const session = await decrypt<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }>(cookie as string);

  if (!session.accessToken) {
    redirect("/login");
  }

  if (session.expiresAt < new Date()) {
    await updateSession();
  }

  return session;
};
