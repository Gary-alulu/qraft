import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import Scan from "@/models/Scan";
import { SCAN_MILESTONES } from "./rules";
import { emitNotification } from "./engine";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

/**
 * Checks if a scan event pushed the QR count across a milestone
 */
export async function evaluateScanMilestones(qr, currentCount) {
  if (!qr || !qr.userId) return;

  for (const milestone of SCAN_MILESTONES) {
    if (currentCount >= milestone && (currentCount - 1) < milestone) {
      await emitNotification(qr.userId, "qr_milestone", {
        qr,
        threshold: milestone,
      });
      break;
    }
  }
}

/**
 * Checks if recent scans indicate a sudden traffic spike or foreign surge
 */
export async function evaluateScanTrafficVelocity(qrId) {
  try {
    await dbConnect();
    const qr = await QRCode.findById(qrId);
    if (!qr || !qr.userId) return;

    const oneHourAgo = new Date(Date.now() - HOUR_MS);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * HOUR_MS);

    // Scans in last hour
    const lastHourCount = await Scan.countDocuments({
      qrCodeId: qr._id,
      createdAt: { $gte: oneHourAgo },
    });

    // Scans in previous 23 hours to get hourly average
    const previousScans = await Scan.countDocuments({
      qrCodeId: qr._id,
      createdAt: { $gte: twentyFourHoursAgo, $lt: oneHourAgo },
    });

    const hourlyBaseline = Math.max(5, Math.round(previousScans / 23));

    // If last hour is 3.5x+ baseline and at least 30 scans
    if (lastHourCount >= 30 && lastHourCount >= hourlyBaseline * 3.5) {
      const multiplier = Math.round((lastHourCount / hourlyBaseline) * 10) / 10;
      const todayBucket = new Date().toISOString().slice(0, 13); // bucket by hour

      await emitNotification(qr.userId, "traffic_spike", {
        qr,
        currentRate: lastHourCount,
        normalRate: `${hourlyBaseline}/hr`,
        multiplier,
        timeWindow: "hour",
        dateBucket: todayBucket,
      });
    }
  } catch (err) {
    console.error("[evaluateScanTrafficVelocity error]:", err);
  }
}

/**
 * Evaluates expiration dates across user's active QR codes
 */
export async function evaluateUserExpirations(userId) {
  try {
    await dbConnect();
    const now = Date.now();
    const activeQrs = await QRCode.find({
      userId,
      expiresAt: { $exists: true, $ne: null },
      status: { $ne: "archived" },
    });

    const results = [];

    for (const qr of activeQrs) {
      const expTime = new Date(qr.expiresAt).getTime();
      const diffMs = expTime - now;
      const diffDays = Math.ceil(diffMs / DAY_MS);

      if (diffMs <= 0) {
        // Expired
        const res = await emitNotification(userId, "qr_expired", { qr });
        results.push(res);
      } else if (diffDays <= 1) {
        // 24 hours left
        const res = await emitNotification(userId, "qr_expires_1d", { qr, daysLeft: 1 });
        results.push(res);
      } else if (diffDays <= 3) {
        // 3 days left
        const res = await emitNotification(userId, "qr_expires_3d", { qr, daysLeft: 3 });
        results.push(res);
      } else if (diffDays <= 7) {
        // 7 days left
        const res = await emitNotification(userId, "qr_expires_7d", { qr, daysLeft: diffDays });
        results.push(res);
      }
    }

    return results;
  } catch (err) {
    console.error("[evaluateUserExpirations error]:", err);
    return [];
  }
}

/**
 * Evaluates health of dynamic QR code destinations
 */
export async function checkDestinationStatus(qr) {
  if (!qr?.destinationUrl || !qr.isDynamic) return { ok: true };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(qr.destinationUrl, {
      method: "HEAD",
      signal: controller.signal,
      headers: { "User-Agent": "Qraft-HealthCheck/1.0" },
    }).catch(() => null);

    clearTimeout(timeout);

    if (res && (res.status === 404 || res.status >= 500)) {
      const todayBucket = new Date().toISOString().slice(0, 10);
      await emitNotification(qr.userId, "broken_destination", {
        qr,
        destinationUrl: qr.destinationUrl,
        httpStatus: res.status,
        dateBucket: todayBucket,
      });
      return { ok: false, status: res.status };
    }

    return { ok: true, status: res?.status || 200 };
  } catch (err) {
    console.error("[checkDestinationStatus error]:", err);
    return { ok: false, error: err.message };
  }
}
