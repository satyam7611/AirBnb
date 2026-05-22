import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Shared JWT secret (matching the backend)
const JWT_SECRET = process.env.JWT_SECRET || "fdgtieorudsocxo";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of protected routes that require authentication
  const protectedRoutes = ["/listings", "/profile", "/reservations", "/host"];
  
  // Check if current route is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Extract the JWT token from the HTTP-only cookie
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie?.value;

  if (isProtectedRoute) {
    if (!token) {
      // Redirect to /login if token is missing
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      // Keep track of the original page to redirect back after login
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
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
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
        const explorerUrl = request.nextUrl.clone();
        explorerUrl.pathname = "/listings";
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
