import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import File from "@/models/File";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
];

export async function POST(req) {
  try {
    let userId = null;
    try {
      const session = await auth();
      userId = session?.user?.id || null;
    } catch {}

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await dbConnect();

    const saved = await File.create({
      userId,
      filename: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
      originalName: file.name,
      contentType: file.type,
      size: file.size,
      data: buffer,
    });

    const origin = req.headers.get("origin") || new URL(req.url).origin;
    const url = `${origin}/api/files/${saved._id}`;

    return NextResponse.json(
      { success: true, fileId: saved._id, filename: saved.originalName, url },
      { status: 201 }
    );
  } catch (error) {
    console.error("FILE UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: true, data: [] });
    }

    await dbConnect();
    const files = await File.find({ userId: session.user.id })
      .select("-data")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: files });
  } catch (error) {
    console.error("LIST FILES ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
