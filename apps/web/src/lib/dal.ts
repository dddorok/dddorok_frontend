import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { decrypt } from "./jose";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    redirect("/login");
  }
  const session = await decrypt<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }>(cookie);

  if (!session.accessToken) {
    redirect("/login");
  }

  return session;
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  return session;
});
