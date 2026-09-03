import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import File from "@/models/File";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
    }

    await dbConnect();
    const file = await File.findById(id).select("data contentType originalName");

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return new NextResponse(file.data, {
      headers: {
        "Content-Type": file.contentType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(file.originalName)}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("FILE SERVE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
