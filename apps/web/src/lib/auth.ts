"use server";

import { cookies } from "next/headers";

import { decrypt, encrypt } from "./jose";

import { refreshToken } from "@/services/auth";
import { apiInstance } from "@/services/instance";

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
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, session, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  console.log("updateSession: ");
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

  console.log("payload: ", payload);
  if (!payload) {
    return null;
  }

  try {
    const data = await refreshToken(payload.refreshToken);

    const expires = new Date(Date.now() + sessionExpiresAt);
    const newSession = await encrypt({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: expires,
    });
    console.log("newSession: ", newSession);
    cookieStore.set(sessionCookieName, newSession, {
      httpOnly: false,
      secure: true,
      // expires: expires,
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.error("error: ", error);
    await deleteSession();
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(sessionCookieName)?.value;
  return session ? decrypt(session) : null;
}

export async function deleteSession() {
  console.log("deleteSession: ");
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function createTestSession() {
  const data = await apiInstance
    .get<{
      data: {
        access_token: string;
        refresh_token: string;
      };
    }>("auth/test-token")
    .json();
  const expiresAt = new Date(Date.now() + 60 * 100000000); // 1분 만료
  const session = await encrypt({
    accessToken: data.data.access_token,
    refreshToken: data.data.refresh_token,
    expiresAt,
  });
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, session, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}
