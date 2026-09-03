import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import Scan from "@/models/Scan";
import { validateDestinationUrl } from "@/lib/security";

const parseAllowedHosts = () => {
  const raw = process.env.REDIRECT_ALLOWED_HOSTS;
  if (!raw) return null;
  return raw.split(",").map((h) => h.trim().toLowerCase()).filter(Boolean);
};

export async function GET(req, { params }) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    await dbConnect();

    // 1. Find the dynamic QR code
    const qr = await QRCode.findOne({ shortSlug: slug, isDynamic: true });

    if (!qr || qr.status !== "active") {
      // Could redirect to a custom "Not Found / Inactive" page on Qraft
      return NextResponse.redirect(new URL("/not-found", req.url));
    }

    // 2. Validate the destination at redirect time (defense in depth).
    //    Blocks javascript:/data:/vbscript: and preserves the allow-list.
    const safeDestination = validateDestinationUrl(qr.destinationUrl, parseAllowedHosts());
    const destination = safeDestination || "https://qraft.app";

    // 3. Extract Request Info for Analytics asynchronously
    const ipAddress = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    
    // Simple device detection logic (could use proper UA parsing library in prod)
    let deviceType = "desktop";
    if (/Mobi|Android/i.test(userAgent)) deviceType = "mobile";
    if (/Tablet|iPad/i.test(userAgent)) deviceType = "tablet";

    // 4. Save Scan Event
    await Scan.create({
      qrCodeId: qr._id,
      ipAddress,
      userAgent,
      deviceType,
      // Geo-location usually comes from Vercel headers (x-vercel-ip-country) or similar
      country: req.headers.get("x-vercel-ip-country") || "unknown"
    });

    // 5. Increment scan count on the QR doc (atomic)
    await QRCode.findByIdAndUpdate(qr._id, { $inc: { scansCount: 1 } });

    // 6. Redirect the user to the validated destination
    return NextResponse.redirect(destination, 302);

  } catch (error) {
    console.error("REDIRECT ENGINE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
