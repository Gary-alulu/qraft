import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * In-process cache mapping Supabase user email -> Mongo User _id so every
 * authenticated API call doesn't re-query Mongo. Keyed by email because that's
 * the stable identifier across sign-in methods (email/password + OAuth).
 */
function getUserCache() {
  if (!global.supabaseUserCache) global.supabaseUserCache = new Map();
  return global.supabaseUserCache;
}

/**
 * Resolve a Supabase user to the app's Mongo User document (find-or-create by
 * email). Returns the Mongo _id as the canonical id so existing code that uses
 * `session.user.id` with User.findById / QRCode userId lookups keeps working.
 */
async function resolveDbUser(supabaseUser) {
  const email = String(supabaseUser.email || "").toLowerCase();
  if (!email) return null;

  const cache = getUserCache();
  if (cache.has(email)) {
    return { id: cache.get(email) };
  }

  await dbConnect();

  let dbUser = await User.findOne({ email });
  if (!dbUser) {
    const metadata = supabaseUser.user_metadata || {};
    dbUser = await User.create({
      name:
        metadata.full_name ||
        metadata.name ||
        email.split("@")[0] ||
        "User",
      email,
      password: `supabase:${supabaseUser.id}`,
      avatar: metadata.avatar_url || metadata.picture || "",
    });
  }

  cache.set(email, dbUser._id.toString());

  return {
    id: dbUser._id.toString(),
    email: dbUser.email,
    name: dbUser.name || dbUser.email?.split("@")[0] || "User",
    role: dbUser.role || "user",
  };
}

/**
 * Supabase Auth-backed session helper.
 *
 * Returns the same shape the app relied on with NextAuth:
 *   { user: { id, email, name, role } }   (or null when signed out)
 *
 * `id` is the Mongo User _id. All existing `await auth()` callers in server
 * components and API routes keep working without changes.
 */
export async function auth() {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
          // Called from a Server Component; safe to ignore when middleware
          // has already refreshed the session cookies.
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  if (!user.email) {
    return {
      user: {
        id: user.id,
        email: "",
        name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
        role: "user",
      },
    };
  }

  try {
    const dbUser = await resolveDbUser(user);
    if (dbUser) {
      return { user: dbUser };
    }
  } catch (error) {
    console.error("AUTH DB SYNC ERROR:", error);
  }

  return {
    user: {
      id: user.id,
      email: user.email.toLowerCase(),
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split("@")[0] || "User",
      role: "user",
    },
  };
}