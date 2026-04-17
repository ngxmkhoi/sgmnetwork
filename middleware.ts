import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/lib/types/database";
import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import { updateSession } from "@/lib/supabase/middleware";

// Danh sách User-Agent của bot/scanner độc hại
const BLOCKED_UA_PATTERNS = [
  /sqlmap/i, /nikto/i, /nmap/i, /masscan/i, /zgrab/i,
  /python-requests\/[01]\./i, /go-http-client\/1\./i,
  /curl\/[0-6]\./i, /wget\/[01]\./i,
];

// Các path nguy hiểm cần chặn hoàn toàn
const BLOCKED_PATHS = [
  "/wp-admin", "/wp-login", "/.env", "/config", "/backup",
  "/phpmyadmin", "/admin.php", "/.git", "/xmlrpc.php",
  "/shell", "/cmd", "/eval",
];

function isBlockedRequest(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname;
  const ua = request.headers.get("user-agent") ?? "";

  // Chặn path nguy hiểm
  if (BLOCKED_PATHS.some((p) => pathname.toLowerCase().startsWith(p))) {
    return true;
  }

  // Chặn bot scanner
  if (BLOCKED_UA_PATTERNS.some((pattern) => pattern.test(ua))) {
    return true;
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  // Chặn request độc hại ngay lập tức
  if (isBlockedRequest(request)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const response = await updateSession(request);

  if (!hasSupabaseEnv || !supabaseAnonKey || !supabaseUrl) {
    if (isAdminPath) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return response;
  }

  // Chỉ check auth cho /admin pages
  if (!pathname.startsWith("/admin")) {
    return response;
  }

  const supabase = createServerClient<Database, "public">(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options) {
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Double-check: user phải có trong bảng users (đã được cấp quyền)
  const { data: profile } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("error", "google_not_allowed");
    return NextResponse.redirect(loginUrl);
  }

  // Thêm security headers cho admin pages
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/auth/:path*",
    "/wp-admin/:path*",
    "/.env",
    "/.git/:path*",
  ],
};
