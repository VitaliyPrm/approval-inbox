import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = [
  "/dashboard",
  "/projects",
  "/settings",
  "/notifications",
];

const publicRoutes = [
  "/login",
  "/signup",
  "/auth",
  "/c/",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle i18n redirect first
  const i18nResponse = intlMiddleware(request);
  if (i18nResponse) {
    return i18nResponse;
  }

  const pathWithoutLocale = pathname.replace(/^\/(en|ru)(\/|$)/, "/");

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route) || pathWithoutLocale.startsWith(route)
  );
  const isPublic = publicRoutes.some((route) =>
    pathname.startsWith(route) || pathWithoutLocale.startsWith(route)
  );

  // Skip middleware for static files, API routes, and client portal
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/c/") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Record<string, unknown>)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if protected and not authenticated
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if authenticated and on auth pages
  if (isPublic && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};