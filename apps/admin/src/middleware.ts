import { NextRequest, NextResponse } from "next/server";

import { getSession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 로그인 페이지와 API 경로는 인증 체크에서 제외
  if (
    pathname.startsWith("/oauth") ||
    pathname.startsWith("/api") ||
    pathname.includes("_next") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  const session = await getSession();
  // 토큰 확인 (로그인 상태 확인)
  // const token = await getToken({ req: request });

  // 로그인되지 않았으면 로그인 페이지로 리디렉션
  if (!session) {
    const url = new URL("/oauth/login", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 지정
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
