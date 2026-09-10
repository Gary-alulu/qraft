/**
 * QRAFT RESPONSIVE HTML EMAIL TEMPLATES
 *
 * Clean, table-based, fully compatible with Outlook, Gmail, Apple Mail,
 * adhering to Qraft's royal-blue and cyan design system.
 */

import { NOTIFICATION_CATEGORIES, NOTIFICATION_PRIORITIES } from "@/lib/notifications/rules";

export function renderNotificationEmail({ notification, user, baseUrl = "https://qraft.app" }) {
  const category = NOTIFICATION_CATEGORIES[notification.category] || { label: notification.category, icon: "🔔" };
  const priority = NOTIFICATION_PRIORITIES[notification.priority] || NOTIFICATION_PRIORITIES.info;
  const meta = notification.metadata || {};
  const recipientName = user?.name?.split(" ")[0] || "there";

  // Target full URL for CTA
  let ctaUrl = notification.actionUrl || "/dashboard";
  if (ctaUrl.startsWith("/")) {
    ctaUrl = `${baseUrl}${ctaUrl}`;
  }

  const settingsUrl = `${baseUrl}/dashboard/settings`;

  // Color mappings
  const priorityColor = priority.color || "#1E3A5F";
  const priorityBg = priority.badgeBg || "rgba(30, 58, 95, 0.08)";

  // Build telemetry table cells if metadata exists
  const telemetryRows = [];
  if (meta.detectedTraffic !== undefined) {
    telemetryRows.push(`<tr><td style="padding: 8px 12px; color: #64748B; font-size: 13px;">Detected Traffic</td><td style="padding: 8px 12px; color: #0A1628; font-weight: 700; font-size: 14px; text-align: right;">${Number(meta.detectedTraffic).toLocaleString()} scans</td></tr>`);
  }
  if (meta.expectedTraffic) {
    telemetryRows.push(`<tr><td style="padding: 8px 12px; color: #64748B; font-size: 13px;">Expected Baseline</td><td style="padding: 8px 12px; color: #0A1628; font-weight: 700; font-size: 14px; text-align: right;">${meta.expectedTraffic}</td></tr>`);
  }
  if (meta.differencePercent) {
    telemetryRows.push(`<tr><td style="padding: 8px 12px; color: #64748B; font-size: 13px;">Difference</td><td style="padding: 8px 12px; color: #EF4444; font-weight: 700; font-size: 14px; text-align: right;">${meta.differencePercent}</td></tr>`);
  }
  if (meta.topSource) {
    telemetryRows.push(`<tr><td style="padding: 8px 12px; color: #64748B; font-size: 13px;">Top Origin</td><td style="padding: 8px 12px; color: #0A1628; font-weight: 700; font-size: 14px; text-align: right;">${meta.topSource}</td></tr>`);
  }
  if (meta.milestone !== undefined) {
    telemetryRows.push(`<tr><td style="padding: 8px 12px; color: #64748B; font-size: 13px;">Milestone Reached</td><td style="padding: 8px 12px; color: #10B981; font-weight: 700; font-size: 14px; text-align: right;">${Number(meta.milestone).toLocaleString()} scans</td></tr>`);
  }
  if (meta.multiplier) {
    telemetryRows.push(`<tr><td style="padding: 8px 12px; color: #64748B; font-size: 13px;">Traffic Multiplier</td><td style="padding: 8px 12px; color: #F59E0B; font-weight: 700; font-size: 14px; text-align: right;">${meta.multiplier}× normal</td></tr>`);
  }
  if (meta.daysLeft !== undefined) {
    telemetryRows.push(`<tr><td style="padding: 8px 12px; color: #64748B; font-size: 13px;">Time Remaining</td><td style="padding: 8px 12px; color: #F59E0B; font-weight: 700; font-size: 14px; text-align: right;">${meta.daysLeft} days</td></tr>`);
  }
  if (meta.httpStatus) {
    telemetryRows.push(`<tr><td style="padding: 8px 12px; color: #64748B; font-size: 13px;">HTTP Status</td><td style="padding: 8px 12px; color: #EF4444; font-weight: 700; font-size: 14px; text-align: right;">${meta.httpStatus} Error</td></tr>`);
  }
  if (meta.scoreBefore !== undefined && meta.scoreAfter !== undefined) {
    telemetryRows.push(`<tr><td style="padding: 8px 12px; color: #64748B; font-size: 13px;">Scanability Score</td><td style="padding: 8px 12px; color: #F59E0B; font-weight: 700; font-size: 14px; text-align: right;">${meta.scoreBefore} → ${meta.scoreAfter}</td></tr>`);
  }

  const telemetryTableHtml = telemetryRows.length > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; margin: 18px 0; border-collapse: collapse;">
      ${telemetryRows.join("")}
    </table>
  ` : "";

  const recommendedActionHtml = meta.recommendedAction ? `
    <div style="background-color: rgba(239, 68, 68, 0.05); border-left: 4px solid #EF4444; padding: 12px 16px; margin: 18px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0 0 4px 0; color: #EF4444; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Recommended Action</p>
      <p style="margin: 0; color: #334155; font-size: 13px; line-height: 1.4;">${meta.recommendedAction}</p>
    </div>
  ` : "";

  const subject = `[Qraft] ${category.icon} ${notification.title}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${notification.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F0F4F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F0F4F8; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 10px 30px rgba(10, 22, 40, 0.05);">
          
          <!-- Top Brand Header -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0A1628; border-bottom: 2px solid #00D4FF;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 800; letter-spacing: 0.1em; color: #FFFFFF; font-family: sans-serif;">QRAFT</span>
                    <span style="font-size: 11px; font-weight: 600; color: #00D4FF; letter-spacing: 0.08em; text-transform: uppercase; margin-left: 8px;">Smart Alert</span>
                  </td>
                  <td align="right">
                    <span style="font-size: 20px;">${category.icon}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Priority & Category Tag Bar -->
          <tr>
            <td style="padding: 16px 32px 0 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: ${priorityBg}; border: 1px solid ${priorityColor}; border-radius: 999px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: ${priorityColor}; text-transform: uppercase; letter-spacing: 0.05em;">
                    ${priority.label}
                  </td>
                  <td style="padding-left: 10px; font-size: 12px; color: #64748B; font-weight: 500;">
                    ${category.label}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 18px 32px 28px 32px;">
              <h1 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0A1628; line-height: 1.3;">
                ${notification.title}
              </h1>

              <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569; line-height: 1.5;">
                Hello ${recipientName},
              </p>

              <p style="margin: 0 0 16px 0; font-size: 15px; color: #1E293B; line-height: 1.5;">
                ${notification.message}
              </p>

              ${notification.resourceName ? `
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #1E3A5F; font-weight: 600;">
                  Resource: <span>${notification.resourceName}</span>
                </p>
              ` : ""}

              <!-- Telemetry Stat Box -->
              ${telemetryTableHtml}

              <!-- Recommended Action Box -->
              ${recommendedActionHtml}

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="${ctaUrl}" target="_blank" style="display: inline-block; background-color: #1E3A5F; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; padding: 13px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);">
                      ${notification.actionLabel || "View in Qraft →"}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748B;">
                You are receiving this because you enabled email alerts for your Qraft account.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94A3B8;">
                <a href="${settingsUrl}" target="_blank" style="color: #1E3A5F; text-decoration: underline; font-weight: 500;">
                  Manage Notification Preferences
                </a>
                &nbsp;•&nbsp;
                <a href="${baseUrl}" target="_blank" style="color: #64748B; text-decoration: none;">
                  Qraft Dashboard
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return { subject, html };
}
