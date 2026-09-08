import { auth } from "@/auth";

/**
 * Role-gated session helper for admin-only pages and API routes.
 * Returns the auth session object when the caller is an admin, otherwise null.
 */
export async function getAdminSession() {
  const session = await auth();
  if (!session?.user) return null;
  if (session.user.role !== "admin") return null;
  return session;
}