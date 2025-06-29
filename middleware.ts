import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/admin", "/profile"];

export async function middleware(req: NextRequest) {
    const { nextUrl, headers } = req;
    const sessionCookie = getSessionCookie(req);

    const requestHeaders = new Headers(headers);
    requestHeaders.set("x-url", req.url);

    const res = NextResponse.next({ request: { headers: requestHeaders } });

    const isLoggedIn = !!sessionCookie;
    const isOnProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
    const isOnAuthRoute = nextUrl.pathname.startsWith("/auth");

    if (isOnProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (isOnAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/profile", req.url));
    }

    return res;
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
