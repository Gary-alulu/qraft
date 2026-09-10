import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { getSafeNext } from "@/lib/auth-redirect";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Handles redirects from Supabase email flows (OAuth, magic link, email
// confirmation, password recovery). The verification token arrives either as a
// PKCE `code` or as `token_hash` + `type`; we exchange/verify it here so a
// session is established in the server cookies, then ensure a Mongo user exists
// (via auth()) and bounce the user to their destination.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const confirmationToken = searchParams.get("confirmation_token");
  const type = searchParams.get("type") || "signup";
  const nextParam = getSafeNext(searchParams.get("next"));

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

  // PKCE: exchange the short-lived code for a session (requires the code
  // verifier stored by the browser client during signUp/signInWithOtp).
  if (code) {
    await supabase.auth.exchangeCodeForSession(code).catch(() => null);
  } else {
    // Implicit/legacy: verify the token directly from the email link.
    const token = tokenHash || confirmationToken;
    if (token) {
      await supabase.auth.verifyOtp({ token_hash: token, type }).catch(() => null);
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const origin = new URL(request.url).origin;
  const destination = user ? nextParam : "/login";

  if (user) {
    // Ensure Mongo user exists and keep the cookie fresh.
    await auth().catch(() => null);
  }

  return NextResponse.redirect(new URL(destination, origin));
}