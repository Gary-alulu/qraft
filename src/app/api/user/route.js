import { NextResponse } from "next/server";
import { auth, getSupabaseUser } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import QRCode from "@/models/QRCode";
import Scan from "@/models/Scan";
import Folder from "@/models/Folder";
import { createClient } from "@supabase/supabase-js";
import { isSameOrigin } from "@/lib/security";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("GET USER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    // Only allow safe fields to be updated — never allow role/plan/password updates here
    const { name, company, jobTitle, avatar, timezone, language, notifications } = body;

    const allowedUpdates = {};
    if (name !== undefined) allowedUpdates.name = name;
    if (company !== undefined) allowedUpdates.company = company;
    if (jobTitle !== undefined) allowedUpdates.jobTitle = jobTitle;
    if (avatar !== undefined) allowedUpdates.avatar = avatar;
    if (timezone !== undefined) allowedUpdates.timezone = timezone;
    if (language !== undefined) allowedUpdates.language = language;
    if (notifications !== undefined) allowedUpdates.notifications = notifications;

    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUser = await getSupabaseUser();

    const mongoUserId = session.user.id;

    // 1) Remove the user's Mongo data (folders, QR codes, their scans, then the user).
    await dbConnect();
    const qrIds = await QRCode.find({ userId: mongoUserId }).distinct("_id");
    await Promise.all([
      Folder.deleteMany({ userId: mongoUserId }),
      Scan.deleteMany({ qrCodeId: { $in: qrIds } }),
      QRCode.deleteMany({ userId: mongoUserId }),
    ]);
    await User.deleteOne({ _id: mongoUserId });

    // 2) Delete the Supabase auth account (service role is required).
    if (supabaseUser?.id) {
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && serviceRoleKey) {
        const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { error } = await admin.auth.admin.deleteUser(supabaseUser.id);
        if (error) {
          console.error("SUPABASE DELETE USER ERROR:", error.message);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
