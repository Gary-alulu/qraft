import { NextResponse } from "next/server";

// Legacy NextAuth handlers are no longer used. All auth now goes through
// Supabase (/api/auth/signin and callback are managed by Supabase). Keep this
// route redirecting to the login page so stale bookmarks don't 404.
export function GET(request) {
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(new URL("/login", origin));
}
export { GET as POST };