import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_SESSION_TOKEN_NAME,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "./lib/constants";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const isLoggedIn = !!(await cookies()).get(AUTH_SESSION_TOKEN_NAME)?.value;

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isAuthRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname;

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    return Response.redirect(
      new URL(
        `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        nextUrl
      )
    );
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
