import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Folder from "@/models/Folder";
import { isSameOrigin } from "@/lib/security";

export async function POST(req) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    await dbConnect();

    const newFolder = await Folder.create({
      userId: session.user.id,
      name,
      color: color || "#1E3A5F",
    });

    return NextResponse.json({ success: true, data: newFolder }, { status: 201 });
  } catch (error) {
    console.error("CREATE FOLDER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const folders = await Folder.find({ userId: session.user.id }).sort({ name: 1 });

    return NextResponse.json({ success: true, data: folders });
  } catch (error) {
    console.error("GET FOLDERS ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
