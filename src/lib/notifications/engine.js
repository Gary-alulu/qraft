import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import NotificationPreference from "@/models/NotificationPreference";
import User from "@/models/User";
import { SMART_RULES } from "./rules";
import { sendEmail } from "@/lib/email/client";
import { renderNotificationEmail } from "@/lib/email/templates";

/**
 * Ensures user has a preferences document, or returns default preferences
 */
export async function getUserPreferences(userId) {
  await dbConnect();
  let prefs = await NotificationPreference.findOne({ userId });
  if (!prefs) {
    prefs = await NotificationPreference.create({ userId });
  }
  return prefs;
}

/**
 * Dispatches notification to configured channels
 */
async function dispatchChannels({ userPrefs, notification }) {
  // Phase 1: In-app is automatically active when saved to MongoDB.

  // Phase 2: Email channel delivery
  if (userPrefs.email) {
    try {
      const user = await User.findById(notification.userId).select("name email");
      if (user?.email) {
        const { subject, html } = renderNotificationEmail({ notification, user });
        await sendEmail({
          to: user.email,
          subject,
          html,
          text: `${notification.title}\n\n${notification.message}`,
        });
      }
    } catch (emailErr) {
      console.error("[dispatchChannels Email Error]:", emailErr);
    }
  }

  // Phase 3: Push channel dispatch stub
  if (userPrefs.push) {
    // Web Push hook ready for subscription worker
  }
}

/**
 * Emit a smart notification based on an event / rule
 *
 * @param {string} userId - Target User ID
 * @param {string} ruleId - Matching rule identifier from SMART_RULES
 * @param {object} params - Rule parameters (e.g. { qr, threshold, ... })
 * @param {object} [options] - Overrides or custom dedupKey
 * @returns {Promise<{ created: boolean, notification: object|null, reason?: string }>}
 */
export async function emitNotification(userId, ruleId, params = {}, options = {}) {
  try {
    await dbConnect();

    const rule = SMART_RULES[ruleId];
    if (!rule) {
      console.warn(`[NotificationEngine] Unknown ruleId: ${ruleId}`);
      return { created: false, notification: null, reason: "unknown_rule" };
    }

    // 1. Check User Notification Preferences
    const prefs = await getUserPreferences(userId);
    if (!prefs.inApp) {
      return { created: false, notification: null, reason: "in_app_disabled" };
    }

    if (rule.preferenceKey && prefs[rule.preferenceKey] === false) {
      return { created: false, notification: null, reason: "rule_preference_disabled" };
    }

    // 2. Compute Unique Deduplication Key
    let dedupKey = options.dedupKey;
    if (!dedupKey && typeof rule.createDedupKey === "function") {
      const resourceId = params.qr?._id?.toString() || params.qr?.id || params.resourceId || userId;
      const extra = params.threshold || params.dateBucket || params.daysLeft || "active";
      dedupKey = rule.createDedupKey(resourceId, extra);
    }

    // 3. Deduplication Check: Prevent Duplicate Alerts
    if (dedupKey) {
      const existing = await Notification.findOne({ userId, dedupKey });
      if (existing) {
        return { created: false, notification: existing, reason: "duplicate_skipped" };
      }
    }

    // 4. Build Notification Content
    const payload = rule.buildNotification(params);

    // 5. Persist to MongoDB
    const notification = await Notification.create({
      userId,
      type: payload.type,
      category: payload.category,
      priority: payload.priority,
      title: payload.title,
      message: payload.message,
      resourceType: payload.resourceType || "qr",
      resourceId: payload.resourceId || null,
      resourceName: payload.resourceName || "",
      actionUrl: payload.actionUrl || "",
      actionLabel: payload.actionLabel || "View Details",
      metadata: payload.metadata || {},
      read: false,
      dedupKey: dedupKey || undefined,
    });

    // 6. Dispatch Delivery Channels (Email / Push)
    await dispatchChannels({ userPrefs: prefs, notification });

    return { created: true, notification };
  } catch (error) {
    console.error("[NotificationEngine ERROR]:", error);
    return { created: false, notification: null, error: error.message };
  }
}
