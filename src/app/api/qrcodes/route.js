import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import QRDesign from "@/models/QRDesign";
import { generateShortSlug, validateDestinationUrl, isSameOrigin } from "@/lib/security";

// Hosts the redirect engine is allowed to send users to.
// Configure via REDIRECT_ALLOWED_HOSTS (comma-separated). When unset, any
// http(s) host is permitted (still blocks javascript:/data:/etc. schemes).
const parseAllowedHosts = () => {
  const raw = process.env.REDIRECT_ALLOWED_HOSTS;
  if (!raw) return null;
  return raw.split(",").map((h) => h.trim().toLowerCase()).filter(Boolean);
};

export async function POST(req) {
  // CSRF: reject state-changing requests that didn't originate from our site.
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, type, contentData, isDynamic, destinationUrl, designOptions, folderId } = body;

    // Validate redirect target before storing (for dynamic codes).
    const allowedHosts = parseAllowedHosts();
    let safeDestination = null;
    if (isDynamic) {
      safeDestination = validateDestinationUrl(destinationUrl, allowedHosts);
      if (!safeDestination) {
        return NextResponse.json(
          { error: "Invalid or disallowed destination URL" },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    // 1. Create the QRCode document (secure, high-entropy short slug).
    const newQr = await QRCode.create({
      userId: session.user.id,
      title: title || "Untitled QR Code",
      type,
      contentData,
      isDynamic: !!isDynamic,
      destinationUrl: safeDestination,
      folderId: folderId || null,
      shortSlug: isDynamic ? generateShortSlug(10) : null,
    });

    // 2. Create the associated QRDesign document
    if (designOptions) {
      const newDesign = await QRDesign.create({
        qrCodeId: newQr._id,
        options: designOptions,
      });
      // Link back
      newQr.designId = newDesign._id;
      await newQr.save();
    }

    return NextResponse.json({ success: true, data: newQr }, { status: 201 });
  } catch (error) {
    console.error("CREATE QR ERROR:", error);
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
    const codes = await QRCode.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: codes });
  } catch (error) {
    console.error("GET QR ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
