import { getCookie } from "cookies-next";

export const getCookieValue = async (
  cookieName: string
): Promise<string | null> => {
  if (typeof window !== "undefined") {
    return (await getCookie(cookieName)) ?? null;
  } else {
    const cookieStore = await import("next/headers").then((module) =>
      module.cookies()
    );

    const cookie = cookieStore.get(cookieName)?.value ?? null;
    return cookie;
  }
};
