/**
 * QRAFT SMART NOTIFICATION RULES DEFINITIONS
 *
 * Implements the 15 launch rules across 8 categories:
 *  1. QR scan milestone (🟢 SUCCESS)
 *  2. QR expires in 7 days (🟡 WARNING)
 *  3. QR expires in 3 days (🟡 WARNING)
 *  4. QR expires tomorrow (🔴 CRITICAL)
 *  5. QR expired (🔴 CRITICAL)
 *  6. Traffic spike (🟡 WARNING)
 *  7. Traffic drop (🟡 WARNING)
 *  8. Conversion milestone (🟢 SUCCESS)
 *  9. Campaign performance increase (🟢 SUCCESS)
 * 10. Campaign ending soon (🟡 WARNING)
 * 11. A/B test winner detected (🟢 SUCCESS)
 * 12. Unusual traffic detected (🔴 CRITICAL)
 * 13. Broken destination detected (🔴 CRITICAL)
 * 14. Scanability score decreased (🟡 WARNING)
 * 15. Usage approaching limit (🟡 WARNING)
 */

export const SCAN_MILESTONES = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000];

export const NOTIFICATION_CATEGORIES = {
  performance: { label: "Performance", icon: "📊", color: "#10B981" },
  expiration: { label: "Expiration", icon: "⏰", color: "#F59E0B" },
  security: { label: "Security", icon: "🚨", color: "#EF4444" },
  campaign: { label: "Campaign", icon: "🎯", color: "#6366F1" },
  analytics: { label: "Analytics", icon: "📈", color: "#00D4FF" },
  system: { label: "System", icon: "⚙️", color: "#64748B" },
  team: { label: "Team", icon: "👥", color: "#8B5CF6" },
  account: { label: "Account", icon: "💳", color: "#EC4899" },
};

export const NOTIFICATION_PRIORITIES = {
  info: { label: "Info", color: "#3B82F6", dotColor: "#60A5FA", badgeBg: "rgba(59, 130, 246, 0.1)" },
  success: { label: "Success", color: "#10B981", dotColor: "#34D399", badgeBg: "rgba(16, 185, 129, 0.1)" },
  warning: { label: "Warning", color: "#F59E0B", dotColor: "#FBBF24", badgeBg: "rgba(245, 158, 11, 0.1)" },
  critical: { label: "Critical", color: "#EF4444", dotColor: "#F87171", badgeBg: "rgba(239, 68, 68, 0.12)" },
};

export const SMART_RULES = {
  // 1. QR scan milestone
  qr_milestone: {
    id: "qr_milestone",
    category: "performance",
    priority: "success",
    preferenceKey: "qrMilestones",
    icon: "🔥",
    createDedupKey: (resourceId, threshold) => `qr_milestone_${resourceId}_${threshold}`,
    buildNotification: ({ qr, threshold }) => ({
      type: "qr_milestone",
      category: "performance",
      priority: "success",
      title: "QR milestone reached",
      message: `"${qr.title || "Untitled QR"}" reached ${threshold.toLocaleString()} scans`,
      resourceType: "qr",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "Untitled QR",
      actionUrl: `/dashboard/analytics?qr=${qr._id || qr.id}`,
      actionLabel: "View Analytics →",
      metadata: {
        milestone: threshold,
        scansCount: qr.scansCount || threshold,
        shortSlug: qr.shortSlug,
      },
    }),
  },

  // 2. QR expires in 7 days
  qr_expires_7d: {
    id: "qr_expires_7d",
    category: "expiration",
    priority: "warning",
    preferenceKey: "expiration7d",
    icon: "⚠️",
    createDedupKey: (resourceId) => `qr_expires_7d_${resourceId}`,
    buildNotification: ({ qr, daysLeft = 7 }) => ({
      type: "qr_expires_7d",
      category: "expiration",
      priority: "warning",
      title: "QR expires in 7 days",
      message: `"${qr.title || "Untitled QR"}" is scheduled to expire in ${daysLeft} days`,
      resourceType: "qr",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "Untitled QR",
      actionUrl: `/studio?edit=${qr._id || qr.id}`,
      actionLabel: "Extend QR →",
      metadata: {
        expiresAt: qr.expiresAt,
        daysLeft,
      },
    }),
  },

  // 3. QR expires in 3 days
  qr_expires_3d: {
    id: "qr_expires_3d",
    category: "expiration",
    priority: "warning",
    preferenceKey: "expiration3d",
    icon: "⚠️",
    createDedupKey: (resourceId) => `qr_expires_3d_${resourceId}`,
    buildNotification: ({ qr, daysLeft = 3 }) => ({
      type: "qr_expires_3d",
      category: "expiration",
      priority: "warning",
      title: "QR expires in 3 days",
      message: `"${qr.title || "Untitled QR"}" will stop redirecting in ${daysLeft} days`,
      resourceType: "qr",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "Untitled QR",
      actionUrl: `/studio?edit=${qr._id || qr.id}`,
      actionLabel: "Extend QR →",
      metadata: {
        expiresAt: qr.expiresAt,
        daysLeft,
      },
    }),
  },

  // 4. QR expires tomorrow (24 hours)
  qr_expires_1d: {
    id: "qr_expires_1d",
    category: "expiration",
    priority: "critical",
    preferenceKey: "expiration24h",
    icon: "🚨",
    createDedupKey: (resourceId) => `qr_expires_1d_${resourceId}`,
    buildNotification: ({ qr }) => ({
      type: "qr_expires_1d",
      category: "expiration",
      priority: "critical",
      title: "QR expires tomorrow",
      message: `"${qr.title || "Untitled QR"}" expires in less than 24 hours. Extend now to prevent broken redirects.`,
      resourceType: "qr",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "Untitled QR",
      actionUrl: `/studio?edit=${qr._id || qr.id}`,
      actionLabel: "Extend QR Now →",
      metadata: {
        expiresAt: qr.expiresAt,
        urgent: true,
      },
    }),
  },

  // 5. QR expired
  qr_expired: {
    id: "qr_expired",
    category: "expiration",
    priority: "critical",
    preferenceKey: "expirationWhenExpired",
    icon: "🔴",
    createDedupKey: (resourceId) => `qr_expired_${resourceId}`,
    buildNotification: ({ qr }) => ({
      type: "qr_expired",
      category: "expiration",
      priority: "critical",
      title: "QR has expired",
      message: `"${qr.title || "Untitled QR"}" has reached its expiration date and is no longer redirecting traffic.`,
      resourceType: "qr",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "Untitled QR",
      actionUrl: `/studio?edit=${qr._id || qr.id}`,
      actionLabel: "Reactivate QR →",
      metadata: {
        expiredAt: qr.expiresAt || new Date(),
      },
    }),
  },

  // 6. Traffic spike
  traffic_spike: {
    id: "traffic_spike",
    category: "performance",
    priority: "warning",
    preferenceKey: "trafficSpikes",
    icon: "🚨",
    createDedupKey: (resourceId, dateBucket) => `traffic_spike_${resourceId}_${dateBucket}`,
    buildNotification: ({ qr, currentRate, normalRate, multiplier, timeWindow = "hour" }) => ({
      type: "traffic_spike",
      category: "performance",
      priority: "warning",
      title: "Traffic spike detected",
      message: `"${qr.title || "Untitled QR"}" received ${currentRate.toLocaleString()} scans in the last ${timeWindow}, approximately ${multiplier}× higher than normal.`,
      resourceType: "qr",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "Untitled QR",
      actionUrl: `/dashboard/analytics?qr=${qr._id || qr.id}`,
      actionLabel: "View Traffic →",
      metadata: {
        currentRate,
        normalRate,
        multiplier,
        timeWindow,
        topCountry: qr.topCountry || "United States",
      },
    }),
  },

  // 7. Traffic drop
  traffic_drop: {
    id: "traffic_drop",
    category: "performance",
    priority: "warning",
    preferenceKey: "trafficDrops",
    icon: "📉",
    createDedupKey: (resourceId, dateBucket) => `traffic_drop_${resourceId}_${dateBucket}`,
    buildNotification: ({ qr, dropPercent = 91, normalDaily = 500, actualDaily = 42 }) => ({
      type: "traffic_drop",
      category: "performance",
      priority: "warning",
      title: "Traffic dropped significantly",
      message: `"${qr.title || "Untitled QR"}" received ${dropPercent}% fewer scans than usual yesterday (${actualDaily} scans vs ${normalDaily} avg).`,
      resourceType: "qr",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "Untitled QR",
      actionUrl: `/dashboard/analytics?qr=${qr._id || qr.id}`,
      actionLabel: "Investigate →",
      metadata: {
        dropPercent,
        normalDaily,
        actualDaily,
      },
    }),
  },

  // 8. Conversion milestone
  conversion_milestone: {
    id: "conversion_milestone",
    category: "analytics",
    priority: "success",
    preferenceKey: "conversionMilestones",
    icon: "🎯",
    createDedupKey: (resourceId, milestoneRate) => `conv_milestone_${resourceId}_${milestoneRate}`,
    buildNotification: ({ qr, conversionRate = 12.1, previousRate = 8.4 }) => ({
      type: "conversion_milestone",
      category: "analytics",
      priority: "success",
      title: "Conversion milestone reached",
      message: `"${qr.title || "Campaign"}" conversion rate reached ${conversionRate}%. (Up from ${previousRate}%).`,
      resourceType: "campaign",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "Campaign",
      actionUrl: `/dashboard/analytics?qr=${qr._id || qr.id}`,
      actionLabel: "View Analytics →",
      metadata: {
        conversionRate,
        previousRate,
        improvementPercent: Math.round(((conversionRate - previousRate) / (previousRate || 1)) * 100),
      },
    }),
  },

  // 9. Campaign performance increase
  campaign_performance_increase: {
    id: "campaign_performance_increase",
    category: "campaign",
    priority: "success",
    preferenceKey: "campaignPerformance",
    icon: "📈",
    createDedupKey: (campaignName, dateBucket) => `campaign_perf_${campaignName}_${dateBucket}`,
    buildNotification: ({ campaignName = "Summer Campaign", increasePercent = 34 }) => ({
      type: "campaign_performance_increase",
      category: "campaign",
      priority: "success",
      title: "Campaign performance increased",
      message: `"${campaignName}" is up ${increasePercent}% in scan engagement this week.`,
      resourceType: "campaign",
      resourceId: campaignName,
      resourceName: campaignName,
      actionUrl: `/dashboard`,
      actionLabel: "View Campaign →",
      metadata: {
        campaignName,
        increasePercent,
      },
    }),
  },

  // 10. Campaign ending soon
  campaign_ending_soon: {
    id: "campaign_ending_soon",
    category: "campaign",
    priority: "warning",
    preferenceKey: "campaignMilestones",
    icon: "⏰",
    createDedupKey: (campaignName, daysLeft) => `campaign_ending_${campaignName}_${daysLeft}d`,
    buildNotification: ({ campaignName = "Summer Launch", daysLeft = 3 }) => ({
      type: "campaign_ending_soon",
      category: "campaign",
      priority: "warning",
      title: "Campaign ending soon",
      message: `"${campaignName}" campaign ends in ${daysLeft} days. Review final performance or extend timeline.`,
      resourceType: "campaign",
      resourceId: campaignName,
      resourceName: campaignName,
      actionUrl: `/dashboard/analytics`,
      actionLabel: "Review Campaign →",
      metadata: {
        campaignName,
        daysLeft,
      },
    }),
  },

  // 11. A/B test winner detected
  ab_test_winner: {
    id: "ab_test_winner",
    category: "campaign",
    priority: "success",
    preferenceKey: "abTestResults",
    icon: "🏆",
    createDedupKey: (resourceId) => `ab_test_winner_${resourceId}`,
    buildNotification: ({ qr, winnerVariant = "Variant B", marginPercent = 63, rateA = "7.2%", rateB = "11.8%" }) => ({
      type: "ab_test_winner",
      category: "campaign",
      priority: "success",
      title: "A/B test winner detected",
      message: `${winnerVariant} is currently converting ${marginPercent}% better (${rateB} vs ${rateA}) on "${qr.title || "QR Experiment"}".`,
      resourceType: "campaign",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "QR Experiment",
      actionUrl: `/dashboard/analytics?qr=${qr._id || qr.id}`,
      actionLabel: "View Experiment →",
      metadata: {
        winnerVariant,
        marginPercent,
        rateA,
        rateB,
      },
    }),
  },

  // 12. Unusual traffic detected (Security)
  unusual_traffic: {
    id: "unusual_traffic",
    category: "security",
    priority: "critical",
    preferenceKey: "suspiciousTraffic",
    icon: "🚨",
    createDedupKey: (resourceId, dateBucket) => `unusual_traffic_${resourceId}_${dateBucket}`,
    buildNotification: ({
      qr,
      scanCount = 4200,
      country = "Germany",
      windowMinutes = 30,
      expectedScans = "120–250",
      topDevice = "Android",
    }) => ({
      type: "unusual_traffic",
      category: "security",
      priority: "critical",
      title: "Unusual traffic detected",
      message: `We detected ${scanCount.toLocaleString()} scans from ${country} in ${windowMinutes} minutes, significantly above your normal traffic baseline.`,
      resourceType: "security",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "QR Code",
      actionUrl: `/dashboard/analytics?qr=${qr._id || qr.id}`,
      actionLabel: "Investigate Security →",
      metadata: {
        detectedTraffic: scanCount,
        expectedTraffic: expectedScans,
        differencePercent: "+1,620%",
        topSource: country,
        topDevice,
        recommendedAction: "Review this traffic for suspicious bot activity or unauthorized scraping.",
      },
    }),
  },

  // 13. Broken destination detected (Security / Reliability)
  broken_destination: {
    id: "broken_destination",
    category: "security",
    priority: "critical",
    preferenceKey: "destinationIssues",
    icon: "🔴",
    createDedupKey: (resourceId, dateBucket) => `broken_dest_${resourceId}_${dateBucket}`,
    buildNotification: ({ qr, destinationUrl, httpStatus = 404 }) => ({
      type: "broken_destination",
      category: "security",
      priority: "critical",
      title: "Destination appears to be unavailable",
      message: `"${qr.title || "Untitled QR"}" currently points to a page returning ${httpStatus} Not Found. Fix the URL to prevent scan failures.`,
      resourceType: "destination",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "Untitled QR",
      actionUrl: `/studio?edit=${qr._id || qr.id}`,
      actionLabel: "Fix Destination URL →",
      metadata: {
        destinationUrl: destinationUrl || qr.destinationUrl,
        httpStatus,
        checkedAt: new Date(),
      },
    }),
  },

  // 14. Scanability score decreased
  scanability_decreased: {
    id: "scanability_decreased",
    category: "system",
    priority: "warning",
    preferenceKey: "scanabilityAlerts",
    icon: "⚠️",
    createDedupKey: (resourceId, dateBucket) => `scanability_${resourceId}_${dateBucket}`,
    buildNotification: ({ qr, scoreBefore = 96, scoreAfter = 71 }) => ({
      type: "scanability_decreased",
      category: "system",
      priority: "warning",
      title: "Scanability decreased",
      message: `Your QR's scanability score dropped from ${scoreBefore} → ${scoreAfter} after the latest design update.`,
      resourceType: "qr",
      resourceId: qr._id?.toString() || qr.id,
      resourceName: qr.title || "Untitled QR",
      actionUrl: `/studio?edit=${qr._id || qr.id}`,
      actionLabel: "Optimize QR Design →",
      metadata: {
        scoreBefore,
        scoreAfter,
      },
    }),
  },

  // 15. Usage approaching limit (Account)
  usage_approaching_limit: {
    id: "usage_approaching_limit",
    category: "account",
    priority: "warning",
    preferenceKey: "usageAlerts",
    icon: "💳",
    createDedupKey: (userId, monthBucket) => `usage_limit_${userId}_${monthBucket}`,
    buildNotification: ({ percentUsed = 85, current = 850, max = 1000, plan = "Free" }) => ({
      type: "usage_approaching_limit",
      category: "account",
      priority: "warning",
      title: "Usage approaching plan limit",
      message: `You've used ${percentUsed}% of your ${plan} plan monthly scan quota (${current.toLocaleString()} of ${max.toLocaleString()} scans).`,
      resourceType: "account",
      resourceId: "billing",
      resourceName: "Account Quota",
      actionUrl: `/dashboard/settings`,
      actionLabel: "Upgrade Plan →",
      metadata: {
        percentUsed,
        current,
        max,
        plan,
      },
    }),
  },
};
