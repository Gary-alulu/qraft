import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Folder from "@/models/Folder";
import QRCode from "@/models/QRCode";
import { isSameOrigin } from "@/lib/security";

export async function PATCH(req, { params }) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, color } = body;

    await dbConnect();

    // Verify ownership
    const folder = await Folder.findOne({ _id: id, userId: session.user.id });
    if (!folder) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;

    const updated = await Folder.findByIdAndUpdate(id, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("UPDATE FOLDER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    // Verify ownership
    const folder = await Folder.findOne({ _id: id, userId: session.user.id });
    if (!folder) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    // Orphan QR codes that were in this folder — don't delete them
    await QRCode.updateMany(
      { folderId: id, userId: session.user.id },
      { $unset: { folderId: "" } }
    );

    await Folder.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Folder deleted. QR codes moved to All Codes." });
  } catch (error) {
    console.error("DELETE FOLDER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
