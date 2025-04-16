import { getCookie } from "cookies-next";

import { decrypt } from "./jose";

export const verifySession = async () => {
  // cookies-next
  const sessionCookieName = "@dddorok/session";
  const cookie = await getCookie(sessionCookieName);
  console.log("cookie: ", cookie);
  // const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    console.log("cookie is null");
    // redirect("/login");
    return null;
  }
  const session = await decrypt<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }>(cookie as string);
  console.log("session: ", session);

  if (!session.accessToken) {
    console.log("session is null");
    // redirect("/login");
    return null;
  }

  return session;
};
