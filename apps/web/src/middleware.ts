import { NextRequest, NextResponse } from "next/server";

const sessionCookieName = "@dddorok/session" as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 로그인 페이지와 공개 경로는 인증 체크에서 제외
  if (
    pathname === "/" ||
    pathname === "/auth/login" ||
    pathname === "/auth/join" ||
    pathname === "/policy/terms" ||
    pathname === "/policy/privacy" ||
    pathname.startsWith("/oauth") ||
    pathname.startsWith("/api") ||
    pathname.includes("_next") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 쿠키에서 세션 확인
  const sessionCookie = request.cookies.get(sessionCookieName);

  // 세션이 없으면 로그인 페이지로 리디렉션
  if (!sessionCookie) {
    const url = new URL("/auth/login", request.url);
    console.log("redirect to login - no sessionCookie");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*|assets).*)"],
};
