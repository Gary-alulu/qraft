import mongoose from "mongoose";

const NotificationPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // Channels
    inApp: {
      type: Boolean,
      default: true,
    },
    email: {
      type: Boolean,
      default: true,
    },
    push: {
      type: Boolean,
      default: false,
    },

    // QR Performance
    qrMilestones: {
      type: Boolean,
      default: true,
    },
    trafficSpikes: {
      type: Boolean,
      default: true,
    },
    trafficDrops: {
      type: Boolean,
      default: true,
    },
    conversionMilestones: {
      type: Boolean,
      default: true,
    },

    // Expiration
    expiration7d: {
      type: Boolean,
      default: true,
    },
    expiration3d: {
      type: Boolean,
      default: true,
    },
    expiration24h: {
      type: Boolean,
      default: true,
    },
    expirationWhenExpired: {
      type: Boolean,
      default: true,
    },

    // Security
    suspiciousTraffic: {
      type: Boolean,
      default: true,
    },
    destinationIssues: {
      type: Boolean,
      default: true,
    },
    securityWarnings: {
      type: Boolean,
      default: true,
    },

    // Campaigns
    campaignMilestones: {
      type: Boolean,
      default: true,
    },
    campaignPerformance: {
      type: Boolean,
      default: true,
    },
    abTestResults: {
      type: Boolean,
      default: true,
    },

    // System & Account
    scanabilityAlerts: {
      type: Boolean,
      default: true,
    },
    usageAlerts: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.NotificationPreference ||
  mongoose.model("NotificationPreference", NotificationPreferenceSchema);
