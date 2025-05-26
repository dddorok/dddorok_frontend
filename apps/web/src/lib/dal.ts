import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";

import { updateSession } from "./auth";
import { getCookieValue } from "./cookie";
import { decrypt } from "./jose";

import { ROUTE } from "@/constants/route";

export const verifySession = async () => {
  const sessionCookieName = "@dddorok/session";

  const cookie = await getCookieValue(sessionCookieName);

  if (!cookie) {
    redirect(ROUTE.LOGIN);
  }

  const session = await decrypt<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }>(cookie as string);

  if (!session.accessToken) {
    console.log("redirect to login - no access token");
    redirect(ROUTE.LOGIN);
  }

  if (session.expiresAt < new Date()) {
    await updateSession();
  }

  return session;
};
