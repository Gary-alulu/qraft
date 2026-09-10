/**
 * QRAFT EMAIL CLIENT
 *
 * Universal email delivery service:
 * 1. Brevo REST API (if BREVO_API_KEY is configured)
 * 2. Fallback Dev Mode (logs to console and stores last email for preview)
 */

let lastSentEmail = null;

export function getLastSentEmail() {
  return lastSentEmail;
}

/**
 * Send an email
 * @param {object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.subject - Email subject line
 * @param {string} params.html - Rendered HTML content
 * @param {string} [params.text] - Plaintext fallback
 * @param {string} [params.from] - Sender address
 */
export async function sendEmail({ to, subject, html, text, from }) {
  const fromAddress = from || process.env.EMAIL_FROM || "Qraft Alerts <alerts@qraft.app>";
  const brevoApiKey = process.env.BREVO_API_KEY;

  lastSentEmail = {
    to,
    from: fromAddress,
    subject,
    html,
    text: text || subject,
    sentAt: new Date().toISOString(),
  };

  // 1. Brevo API Delivery
  if (brevoApiKey) {
    try {
      const fromMatch = fromAddress.match(/^([^<]*)<([^>]*)>$/);
      const sender = fromMatch
        ? { name: fromMatch[1].trim(), email: fromMatch[2].trim() }
        : { email: fromAddress.trim() };

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender,
          to: (Array.isArray(to) ? to : [to]).map((email) => ({ email })),
          subject,
          htmlContent: html,
          textContent: text || subject,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("[Brevo API Error]:", data);
        return { success: false, error: data.message || "Failed to send via Brevo" };
      }

      console.log(`[Email Sent via Brevo] ID: ${data.messageId} To: ${to}`);
      return { success: true, provider: "brevo", id: data.messageId };
    } catch (err) {
      console.error("[Brevo Request Error]:", err);
      return { success: false, error: err.message };
    }
  }

  // 2. Fallback / Local Development Preview
  console.log(`\n================== [QRAFT EMAIL DISPATCH (DEV MODE)] ==================`);
  console.log(`From:    ${fromAddress}`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Status:  Queued / Preview available at /api/notifications/test-email`);
  console.log(`=====================================================================\n`);

  return {
    success: true,
    provider: "dev-preview",
    previewAvailable: true,
  };
}
