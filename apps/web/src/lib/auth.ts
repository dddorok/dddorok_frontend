"use server";

import { cookies } from "next/headers";
import { cache } from "react";

import { decrypt, encrypt } from "./jose";

import { refreshToken } from "@/services/auth";

const sessionCookieName = "@dddorok/session" as const;
const sessionExpiresAt = 60 * 1000; // 1분 (밀리초 단위)

export async function createSession({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const expiresAt = new Date(Date.now() + sessionExpiresAt);
  const session = await encrypt({ accessToken, refreshToken, expiresAt });
  console.log("session: ", session);
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, session, {
    httpOnly: false,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(sessionCookieName)?.value;

  if (!session) {
    return null;
  }

  const payload = await decrypt<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }>(session);

  if (!payload) {
    return null;
  }

  const data = await refreshToken(payload.refreshToken);

  const expires = new Date(Date.now() + sessionExpiresAt);
  const newSession = await encrypt({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: expires,
  });

  cookieStore.set(sessionCookieName, newSession, {
    httpOnly: false,
    secure: true,
    expires: expires,
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
