import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import QRDesign from "@/models/QRDesign";
import { createUniqueShortSlug, validateDestinationUrl, isSameOrigin } from "@/lib/security";
import { validateDocumentFileId } from "@/lib/supabase-server";

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

      await dbConnect();

      // Daily free-tier limit: 5 QR codes per user per day.
      const DAILY_QR_LIMIT = 5;
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const createdToday = await QRCode.countDocuments({
        userId: session.user.id,
        createdAt: { $gte: startOfDay },
      });

      if (createdToday >= DAILY_QR_LIMIT) {
        return NextResponse.json(
          { error: "Daily limit reached. Please try again tomorrow." },
          { status: 429 }
        );
      }

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

      // Document QRs must reference a file that actually exists in storage.
      // Never create a code that points at a missing/corrupt upload. Only
      // verified when the code carries a live (non-empty) URL + fileId.
      const hasLiveDocUrl = Boolean(contentData?.fileId && contentData?.url);
      if (type === "document" && hasLiveDocUrl) {
        const docCheck = await validateDocumentFileId(contentData.fileId);
        if (!docCheck.valid) {
          return NextResponse.json(
            { error: docCheck.error || "Referenced document no longer available. Please re-upload the file." },
            { status: 400 }
          );
        }
      }

      // 1. Create the QRCode document (secure, high-entropy short slug).
      //    A dynamic QR is only trackable through its /r/<slug> link, so the
      //    slug is allocated up-front and retried on any collision.
      let newQr = null;
      for (let attempt = 0; attempt < 3 && !newQr; attempt++) {
        try {
          newQr = await QRCode.create({
            userId: session.user.id,
            title: title || "Untitled QR Code",
            type,
            contentData,
            isDynamic: !!isDynamic,
            destinationUrl: safeDestination,
            folderId: folderId || null,
            shortSlug: isDynamic ? await createUniqueShortSlug(QRCode) : null,
          });
        } catch (err) {
          if (isDynamic && err?.code === 11000 && attempt < 2) continue;
          throw err;
        }
      }

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

    // Determine if this is the user's first QR of the calendar day (server-side
    // source of truth so it stays consistent across devices/browsers).
    const todayCount = await QRCode.countDocuments({
      userId: session.user.id,
      createdAt: { $gte: startOfDay },
    });
    const isFirstQRToday = todayCount === 1;

    return NextResponse.json({ success: true, data: newQr, isFirstQRToday }, { status: 201 });
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
