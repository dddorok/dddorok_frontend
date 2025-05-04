import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";

import { updateSession } from "./auth";
import { decrypt } from "./jose";

export const verifySession = async () => {
  const sessionCookieName = "@dddorok-admin/session";
  const cookie = await getCookie(sessionCookieName);
  console.log("cookie: ", cookie);

  if (!cookie) {
    redirect("/oauth/login");
  }
  const session = await decrypt<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }>(cookie as string);

  if (!session.accessToken) {
    redirect("/oauth/login");
  }

  if (session.expiresAt < new Date()) {
    await updateSession();
  }

  return session;
};
