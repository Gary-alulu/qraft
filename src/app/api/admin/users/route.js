import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import QRCode from "@/models/QRCode";
import Scan from "@/models/Scan";
import Folder from "@/models/Folder";
import { createClient } from "@supabase/supabase-js";
import { isSameOrigin } from "@/lib/security";

const ALLOWED_ROLES = ["user", "admin"];
const ALLOWED_PLANS = ["free", "pro", "business"];

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const users = await User.find().sort({ createdAt: -1 }).limit(200).lean();

    const userIds = users.map((u) => u._id);

    const codeCountsRaw = await QRCode.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", codes: { $sum: 1 } } },
    ]);

    const scanCountsRaw = await Scan.aggregate([
      { $group: { _id: "$qrCodeId", n: { $sum: 1 } } },
      { $lookup: { from: QRCode.collection.name, localField: "_id", foreignField: "_id", as: "qr" } },
      { $unwind: { path: "$qr", preserveNullAndEmptyArrays: true } },
      { $group: { _id: "$qr.userId", scans: { $sum: "$n" } } },
    ]);

    const codeCountMap = {};
    codeCountsRaw.forEach((r) => { codeCountMap[r._id.toString()] = r.codes; });
    const scanCountMap = {};
    scanCountsRaw.forEach((r) => { scanCountMap[r._id && r._id.toString()] = r.scans; });

    const data = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role || "user",
      plan: u.plan || "free",
      joined: (u.createdAt || new Date()).toISOString().split("T")[0],
      codes: codeCountMap[u._id.toString()] || 0,
      scans: scanCountMap[u._id.toString()] || 0,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("ADMIN USERS LIST ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const targetId = body.id;
    if (!targetId) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    await dbConnect();

    const target = await User.findById(targetId);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates = {};
    if (body.role !== undefined) {
      if (!ALLOWED_ROLES.includes(body.role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      // Never allow the acting admin to demote themselves to non-admin.
      if (targetId === session.user.id && body.role !== "admin") {
        return NextResponse.json({ error: "You cannot remove your own admin role" }, { status: 400 });
      }
      updates.role = body.role;
    }

    if (body.plan !== undefined) {
      if (!ALLOWED_PLANS.includes(body.plan)) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
      }
      updates.plan = body.plan;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(targetId, { $set: updates }, { new: true }).select("-password");

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("ADMIN UPDATE USER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("id");
    if (!targetId) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    if (targetId === session.user.id) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    await dbConnect();

    const target = await User.findById(targetId);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the user's Mongo data, then the user, then their Supabase account.
    const qrIds = await QRCode.find({ userId: targetId }).distinct("_id");
    await Promise.all([
      Folder.deleteMany({ userId: targetId }),
      Scan.deleteMany({ qrCodeId: { $in: qrIds } }),
      QRCode.deleteMany({ userId: targetId }),
    ]);
    await User.deleteOne({ _id: targetId });

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && serviceRoleKey) {
      const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data: supabaseUsers } = await admin.auth.admin.listUsers();
      const match = supabaseUsers?.users?.find((u) => String(u.email).toLowerCase() === String(target.email).toLowerCase());
      if (match) {
        const { error } = await admin.auth.admin.deleteUser(match.id);
        if (error) {
          console.error("SUPABASE DELETE USER ERROR:", error.message);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN DELETE USER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}