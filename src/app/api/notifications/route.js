import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const search = searchParams.get("search");
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const skip = (page - 1) * limit;

    const query = { userId };

    if (category && category !== "all") {
      query.category = category;
    }

    if (unreadOnly) {
      query.read = false;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ title: regex }, { message: regex }, { resourceName: regex }];
    }

    const [notifications, unreadCount, totalCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ userId, read: false }),
      Notification.countDocuments(query),
    ]);

    // Compute category breakdowns
    const categoryAgg = await Notification.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", count: { $sum: 1 }, unread: { $sum: { $cond: ["$read", 0, 1] } } } },
    ]);

    const categoryCounts = {};
    categoryAgg.forEach((c) => {
      categoryCounts[c._id] = { total: c.count, unread: c.unread };
    });

    return NextResponse.json({
      notifications,
      unreadCount,
      totalCount,
      categoryCounts,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;
    const body = await req.json().catch(() => ({}));
    const { action = "markAllRead", ids = [] } = body;

    if (action === "markAllRead") {
      const result = await Notification.updateMany(
        { userId, read: false },
        { $set: { read: true, readAt: new Date() } }
      );
      return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
    }

    if (action === "markRead" && Array.isArray(ids) && ids.length > 0) {
      const result = await Notification.updateMany(
        { userId, _id: { $in: ids } },
        { $set: { read: true, readAt: new Date() } }
      );
      return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    // Delete read notifications (Clear Read)
    const result = await Notification.deleteMany({ userId, read: true });
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error("DELETE /api/notifications error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
