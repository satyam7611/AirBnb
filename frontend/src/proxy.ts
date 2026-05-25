import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Shared JWT secret (matching the backend)
const JWT_SECRET = process.env.JWT_SECRET || "fdgtieorudsocxo";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define which paths require authentication
  // We make main listings page and details page PUBLIC (like real Airbnb)
  // Only creation, editing, and profile/reservations/host require login
  const isProtectedRoute =
    pathname === "/listings/new" ||
    (pathname.startsWith("/listings/") && pathname.endsWith("/edit")) ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/reservations") ||
    pathname.startsWith("/host");

  // Extract the JWT token from the HTTP-only cookie
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie?.value;

  if (isProtectedRoute) {
    if (!token) {
      // Redirect to /login if token is missing
      // Using clean new URL constructs to prevent Vercel edge rewrite 404 bugs
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify the JWT token using Web Crypto compatible jose package
      const secretKey = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secretKey);
      return NextResponse.next();
    } catch (err) {
      console.error("JWT token verification failed in Proxy:", err);
      // Clean up the invalid cookie and redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("token");
      return response;
    }
  }

  // Redirect logged-in users away from auth pages (/login, /signup)
  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secretKey);
        // User is already authenticated, redirect them to explorer listings page
        const explorerUrl = new URL("/listings", request.url);
        return NextResponse.redirect(explorerUrl);
      } catch (err) {
        // Token is invalid/expired, let them access login/signup
      }
    }
  }

  return NextResponse.next();
}

// Config to specify which paths the proxy runs on
export const config = {
  matcher: [
    "/listings/:path*",
    "/profile/:path*",
    "/reservations/:path*",
    "/host/:path*",
    "/login",
    "/signup",
  ],
};
