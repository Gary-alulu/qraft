import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import QRDesign from "@/models/QRDesign";
import { createUniqueShortSlug, validateDestinationUrl, isSameOrigin } from "@/lib/security";

const parseAllowedHosts = () => {
  const raw = process.env.REDIRECT_ALLOWED_HOSTS;
  if (!raw) return null;
  return raw.split(",").map((h) => h.trim().toLowerCase()).filter(Boolean);
};

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const qrCode = await QRCode.findOne({ _id: id, userId: session.user.id }).populate("designId");
    if (!qrCode) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: qrCode });
  } catch (error) {
    console.error("GET SINGLE QR ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Full update (from Studio save)
export async function PUT(req, { params }) {
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
    const { title, destinationUrl, status, contentData, designOptions, folderId, isDynamic } = body;

    await dbConnect();

    const existingQr = await QRCode.findOne({ _id: id, userId: session.user.id });
    if (!existingQr) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    // Trackability invariant: a dynamic QR routes through /r/<slug> and is
    // only trackable while it has a short slug. We never allow a dynamic code
    // to be downgraded to static (printed codes encode the redirect link, so
    // it would silently stop tracking/max out at the already-printed URL).
    const willBeDynamic = existingQr.isDynamic || isDynamic === true;
    if (existingQr.isDynamic && isDynamic === false) {
      return NextResponse.json(
        { error: "Dynamic QR codes cannot be converted to static." },
        { status: 400 }
      );
    }

    // Validate redirect target if the code is (or becomes) dynamic. A null or
    // empty value means "keep the existing target" (some types don't carry a
    // URL in their payload on every save).
    let safeDestination;
    let hasDestinationUpdate = false;
    if (typeof destinationUrl === "string" && destinationUrl.trim() !== "") {
      hasDestinationUpdate = true;
      if (willBeDynamic) {
        safeDestination = validateDestinationUrl(destinationUrl, parseAllowedHosts());
        if (!safeDestination) {
          return NextResponse.json(
            { error: "Invalid or disallowed destination URL" },
            { status: 400 }
          );
        }
      } else {
        safeDestination = null;
      }
    }

    const updates = {
      ...(title && { title }),
      ...(hasDestinationUpdate && { destinationUrl: safeDestination }),
      ...(status && { status }),
      ...(contentData && { contentData }),
      ...(folderId !== undefined && { folderId }),
      ...(willBeDynamic && { isDynamic: true }),
    };

    // Every dynamic QR must carry a shortSlug so the redirect engine can
    // track scans. Generate one when a static code is converted to dynamic,
    // or to self-heal any dynamic record that somehow lost its slug.
    if (willBeDynamic && !existingQr.shortSlug) {
      updates.shortSlug = await createUniqueShortSlug(QRCode);
    }

    const updatedQr = await QRCode.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (designOptions && updatedQr.designId) {
      await QRDesign.findByIdAndUpdate(updatedQr.designId, { options: designOptions });
    }

    return NextResponse.json({ success: true, data: updatedQr });
  } catch (error) {
    console.error("UPDATE QR ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Partial update — used by Dashboard actions (archive, move folder, pause)
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
    const { status, folderId, title } = body;

    await dbConnect();

    const existingQr = await QRCode.findOne({ _id: id, userId: session.user.id });
    if (!existingQr) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (folderId !== undefined) updates.folderId = folderId || null;
    if (title !== undefined) updates.title = title;

    const updatedQr = await QRCode.findByIdAndUpdate(id, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, data: updatedQr });
  } catch (error) {
    console.error("PATCH QR ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Hard delete — permanently removes QR and its design
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

    const existingQr = await QRCode.findOne({ _id: id, userId: session.user.id });
    if (!existingQr) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    // Remove associated design document if present
    if (existingQr.designId) {
      await QRDesign.findByIdAndDelete(existingQr.designId);
    }

    await QRCode.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "QR Code permanently deleted." });
  } catch (error) {
    console.error("DELETE QR ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
