import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // The 15 core types + extensible string
    type: {
      type: String,
      required: true,
      index: true,
    },
    // 8 core categories: performance, expiration, security, campaign, analytics, system, team, account
    category: {
      type: String,
      enum: [
        "performance",
        "expiration",
        "security",
        "campaign",
        "analytics",
        "system",
        "team",
        "account",
      ],
      required: true,
      index: true,
    },
    // 4 priorities: info (🔵), success (🟢), warning (🟡), critical (🔴)
    priority: {
      type: String,
      enum: ["info", "success", "warning", "critical"],
      default: "info",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: String,
      enum: ["qr", "campaign", "destination", "security", "account", "system"],
      default: "qr",
    },
    resourceId: {
      type: String,
      default: null,
    },
    resourceName: {
      type: String,
      default: "",
    },
    actionUrl: {
      type: String,
      default: "",
    },
    actionLabel: {
      type: String,
      default: "View Details",
    },
    // Telemetry and rich diagnostic payload (expected scans, difference %, country, device, etc.)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    // Deduplication key to prevent alert spamming (e.g. `qr_milestone_10000_65fa...`)
    dedupKey: {
      type: String,
      index: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast queries: user + unread + date
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, category: 1, createdAt: -1 });

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
