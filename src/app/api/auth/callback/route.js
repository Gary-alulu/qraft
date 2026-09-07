import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { auth } from "@/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Handles the post-OAuth redirect from Supabase. The session cookies are
// already set by Supabase at this point; we ensure a Mongo user exists (via
// auth()) and bounce to /dashboard. Also refresh cookies through the server
// client so the session stays alive in this SSR request.
export async function GET(request) {
  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl || "", supabaseAnonKey || "", {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // ignore
        }
      },
    },
  });

  // Exchange/validate the code is not needed with implicit or PKCE handled by
  // Supabase itself; getUser() verifies session validity.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const origin = new URL(request.url).origin;
  const destination = user ? "/dashboard" : "/login";

  if (user) {
    // Ensure Mongo user exists and keep the cookie fresh.
    await auth().catch(() => null);
  }

  return NextResponse.redirect(new URL(destination, origin));
}