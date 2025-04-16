"use server";

import { getCookie, setCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { decrypt, encrypt } from "./jose";

const sessionCookieName = "@dddorok/session" as const;

export async function createSession({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ accessToken, refreshToken, expiresAt });
  console.log("session: ", session);
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, session, {
    httpOnly: false,
    secure: false,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(sessionCookieName)?.value;
  return session ? decrypt(session) : null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export const getUser = cache(async () => {
  // const session = await verifySession();
  // if (!session) return null;
  // return session;
});
