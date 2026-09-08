import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import QRCode from "@/models/QRCode";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const codes = await QRCode.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const userIds = [...new Set(codes.map((c) => c.userId && c.userId.toString()))].filter(Boolean);
    const users = await User.find({ _id: { $in: userIds } }).select("name email").lean();
    const userMap = {};
    users.forEach((u) => { userMap[u._id.toString()] = u; });

    const data = codes.map((c) => {
      const owner = userMap[c.userId && c.userId.toString()] || {};
      return {
        id: c._id.toString(),
        title: c.title,
        type: c.type,
        isDynamic: !!c.isDynamic,
        status: c.status,
        shortSlug: c.shortSlug || "",
        scans: c.scansCount || 0,
        owner: owner.email || owner.name || c._id.toString(),
        createdAt: (c.createdAt || new Date()).toISOString().split("T")[0],
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("ADMIN QRCODES ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}