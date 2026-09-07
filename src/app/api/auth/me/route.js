import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Lightweight endpoint returning the app-side session user. The client
// AuthProvider polls this after Supabase auth state changes to get the Mongo
// user id/name/role used across the app.
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  return NextResponse.json({ user: session?.user ?? null });
}