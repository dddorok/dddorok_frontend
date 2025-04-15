"use server";

import { cookies } from "next/headers";

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
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, session, {
    httpOnly: true,
    secure: true,
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
