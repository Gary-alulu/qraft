/**
 * QR Engine — Wrapper around qr-code-styling
 * Provides default configurations and scanability analysis.
 */

export const QR_PATTERNS = [
  { id: "square", label: "Square", value: "square" },
  { id: "dots", label: "Dots", value: "dots" },
  { id: "rounded", label: "Rounded", value: "rounded" },
  { id: "classy", label: "Classy", value: "classy" },
  { id: "classy-rounded", label: "Classy Rounded", value: "classy-rounded" },
  { id: "extra-rounded", label: "Extra Rounded", value: "extra-rounded" },
];

export const QR_EYE_FRAMES = [
  { id: "square", label: "Square", value: "square" },
  { id: "dot", label: "Dot", value: "dot" },
  { id: "extra-rounded", label: "Extra Rounded", value: "extra-rounded" },
];

export const QR_EYE_BALLS = [
  { id: "square", label: "Square", value: "square" },
  { id: "dot", label: "Dot", value: "dot" },
];

export const QR_FRAMES = [
  { id: "none", label: "No Frame" },
  { id: "minimal", label: "Minimal" },
  { id: "badge", label: "Badge" },
  { id: "bubble", label: "Bubble" },
  { id: "modern", label: "Modern" },
];

export const DEFAULT_QR_OPTIONS = {
  width: 300,
  height: 300,
  type: "svg",
  data: "https://qraft.app",
  dotsOptions: {
    color: "#1E3A5F",
    type: "rounded",
  },
  cornersSquareOptions: {
    color: "#1E3A5F",
    type: "extra-rounded",
  },
  cornersDotOptions: {
    color: "#00D4FF",
    type: "dot",
  },
  backgroundOptions: {
    color: "#FFFFFF",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 8,
    imageSize: 0.4,
  },
  qrOptions: {
    errorCorrectionLevel: "M",
  },
};

/**
 * Analyze QR scanability based on design choices, data payload, and information/upload status
 * Returns a score 0-100 and list of checks
 */
export function analyzeScanability(options = {}, data = "", context = {}) {
  const checks = [];
  let score = 100;

  const contentData = context?.contentData || {};
  const qrType = context?.type || "website";
  const isDynamic = !!context?.isDynamic;

  // --- 1. Content & Upload Verification ---
  if (qrType === "document") {
    const hasFile = Boolean(contentData.url || contentData.fileId);
    if (hasFile) {
      checks.push({
        status: "pass",
        message: `Document linked: ${contentData.filename || "PDF file ready"}`,
      });
    } else {
      checks.push({
        status: "fail",
        message: "Upload required: Please upload a PDF to link to this QR code",
      });
      score -= 40;
    }
  } else if (qrType === "website" || qrType === "dynamic") {
    const url = (contentData.url || "").trim();
    if (!url) {
      checks.push({
        status: "fail",
        message: "Information required: Destination website URL is empty",
      });
      score -= 35;
    } else if (!/^https?:\/\//i.test(url)) {
      checks.push({
        status: "warn",
        message: "Missing https:// prefix — add protocol so phones launch browser directly",
      });
      score -= 8;
    } else {
      checks.push({
        status: "pass",
        message: `Valid destination URL configured (${url})`,
      });
    }
  } else if (qrType === "wifi") {
    const ssid = (contentData.ssid || "").trim();
    const password = contentData.password || "";
    if (!ssid) {
      checks.push({
        status: "fail",
        message: "Information required: Wi-Fi Network Name (SSID) is missing",
      });
      score -= 35;
    } else {
      checks.push({
        status: "pass",
        message: `Wi-Fi network configured ("${ssid}")`,
      });
      if (!password) {
        checks.push({
          status: "warn",
          message: "No password provided — network will be configured as open",
        });
        score -= 5;
      } else {
        checks.push({
          status: "pass",
          message: "Wi-Fi password configured for one-tap auto-join",
        });
      }
    }
  } else if (qrType === "vcard") {
    const firstName = (contentData.firstName || "").trim();
    const lastName = (contentData.lastName || "").trim();
    const phone = (contentData.phone || "").trim();
    const email = (contentData.email || "").trim();
    const name = [firstName, lastName].filter(Boolean).join(" ");
    if (!name) {
      checks.push({
        status: "fail",
        message: "Information required: Contact name is missing",
      });
      score -= 30;
    } else {
      checks.push({
        status: "pass",
        message: `Contact card configured for ${name}`,
      });
    }
    if (!phone && !email) {
      checks.push({
        status: "warn",
        message: "Incomplete contact: Add at least a phone number or email",
      });
      score -= 15;
    } else {
      checks.push({
        status: "pass",
        message: `Contact channels included (${[phone && "Phone", email && "Email"].filter(Boolean).join(", ")})`,
      });
    }
  } else if (qrType === "phone") {
    const phone = (contentData.phone || "").trim();
    if (!phone) {
      checks.push({
        status: "fail",
        message: "Information required: Phone number is missing",
      });
      score -= 35;
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(phone)) {
      checks.push({
        status: "warn",
        message: "Include country code (e.g. +1 or +254) for international dialing",
      });
      score -= 10;
    } else {
      checks.push({
        status: "pass",
        message: `Phone number formatted for direct calling (${phone})`,
      });
    }
  } else if (qrType === "whatsapp") {
    const phone = (contentData.phone || "").trim();
    const message = (contentData.message || "").trim();
    if (!phone) {
      checks.push({
        status: "fail",
        message: "Information required: WhatsApp phone number is missing",
      });
      score -= 35;
    } else {
      checks.push({
        status: "pass",
        message: "WhatsApp conversation link ready",
      });
      if (message.length > 200) {
        checks.push({
          status: "warn",
          message: `Long pre-filled message increases QR density (${message.length} chars)`,
        });
        score -= 10;
      }
    }
  } else if (qrType === "sms") {
    const phone = (contentData.phone || "").trim();
    if (!phone) {
      checks.push({
        status: "fail",
        message: "Information required: SMS recipient phone number is missing",
      });
      score -= 35;
    } else {
      checks.push({
        status: "pass",
        message: `SMS recipient configured (${phone})`,
      });
    }
  } else if (qrType === "email") {
    const to = (contentData.to || "").trim();
    if (!to) {
      checks.push({
        status: "fail",
        message: "Information required: Recipient email address is missing",
      });
      score -= 35;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      checks.push({
        status: "warn",
        message: "Email address format appears invalid",
      });
      score -= 15;
    } else {
      checks.push({
        status: "pass",
        message: `Email recipient ready (${to})`,
      });
    }
  } else if (qrType === "mpesa") {
    const till = (contentData.till || "").trim();
    if (!till) {
      checks.push({
        status: "fail",
        message: "Information required: Till Number or Paybill is missing",
      });
      score -= 35;
    } else {
      checks.push({
        status: "pass",
        message: `M-Pesa payment recipient configured (${till})`,
      });
    }
  } else if (qrType === "paypal") {
    const username = (contentData.username || "").trim();
    if (!username) {
      checks.push({
        status: "fail",
        message: "Information required: PayPal username is missing",
      });
      score -= 35;
    } else {
      checks.push({
        status: "pass",
        message: `PayPal payment link set for @${username.replace(/^@/, "")}`,
      });
    }
  } else if (qrType === "text") {
    const text = (contentData.text || "").trim();
    if (!text) {
      checks.push({
        status: "fail",
        message: "Information required: Text content is empty",
      });
      score -= 35;
    } else {
      checks.push({
        status: "pass",
        message: `Plain text content entered (${text.length} characters)`,
      });
      if (text.length > 500) {
        checks.push({
          status: "warn",
          message: "Long text produces very dense QR modules — print large for reliability",
        });
        score -= 15;
      }
    }
  } else if (["landing_page", "social", "app_link", "business", "menu", "product", "feedback", "event", "calendar", "rsvp", "ticket", "payment_link", "location"].includes(qrType)) {
    const hasAnyField = Object.values(contentData).some(v => typeof v === "string" && v.trim().length > 0);
    if (!hasAnyField) {
      checks.push({
        status: "warn",
        message: "Information required: Fill in template fields to complete configuration",
      });
      score -= 20;
    } else {
      checks.push({
        status: "pass",
        message: "Template information configured",
      });
    }
  } else if (!data || !String(data).trim()) {
    checks.push({
      status: "fail",
      message: "No data payload provided",
    });
    score -= 40;
  }

  // --- 2. Data Payload Density & Complexity ---
  const dataStr = (data ? String(data) : "").trim();
  const len = dataStr.length;
  if (isDynamic) {
    checks.push({
      status: "pass",
      message: "Dynamic QR enabled: Short redirect URL guarantees fast scan and low density",
    });
  } else if (len > 0) {
    if (len <= 75) {
      checks.push({
        status: "pass",
        message: `Optimal data density (${len} chars) — fast scanning at any distance`,
      });
    } else if (len <= 200) {
      checks.push({
        status: "pass",
        message: `Balanced data density (${len} chars) — high camera readability`,
      });
    } else if (len <= 450) {
      checks.push({
        status: "warn",
        message: `Moderate data density (${len} chars) — print at minimum 3.5 cm (1.4 in)`,
      });
      score -= 10;
    } else {
      checks.push({
        status: "warn",
        message: `High data density (${len} chars) — dense dots may blur on low-end cameras. Consider Dynamic QR.`,
      });
      score -= 20;
    }
  }

  // --- 3. Contrast Check ---
  const fgColor = options.dotsOptions?.color || "#000000";
  const bgColor = options.backgroundOptions?.color || "#FFFFFF";
  const contrastRatio = getContrastRatio(fgColor, bgColor);

  if (contrastRatio >= 7) {
    checks.push({ status: "pass", message: `Excellent contrast ratio (${contrastRatio.toFixed(1)}:1)` });
  } else if (contrastRatio >= 4.5) {
    checks.push({ status: "pass", message: `Good contrast ratio (${contrastRatio.toFixed(1)}:1)` });
    score -= 5;
  } else if (contrastRatio >= 3) {
    checks.push({ status: "warn", message: `Low contrast (${contrastRatio.toFixed(1)}:1) may fail in dim lighting` });
    score -= 15;
  } else {
    checks.push({ status: "fail", message: `Contrast too low (${contrastRatio.toFixed(1)}:1) for reliable camera detection` });
    score -= 30;
  }

  // --- 4. Logo Placement & Error Correction Synergy ---
  const hasLogo = Boolean(options.imageOptions?.image || options.image);
  const logoSize = options.imageOptions?.imageSize || 0;
  const ecl = options.qrOptions?.errorCorrectionLevel || "M";

  if (hasLogo && logoSize > 0) {
    if (len > 200 && (ecl === "L" || ecl === "M")) {
      checks.push({
        status: "fail",
        message: "Dense data with center logo: Set Error Correction to 'Q' or 'H' to prevent scan failure",
      });
      score -= 20;
    } else if (logoSize > 0.35 && ecl !== "H") {
      checks.push({
        status: "warn",
        message: "Large center logo blocks significant modules: Recommend Error Correction 'H'",
      });
      score -= 12;
    } else {
      checks.push({
        status: "pass",
        message: `Logo overlay safely balanced with error correction (${ecl})`,
      });
    }
  } else {
    checks.push({ status: "pass", message: "No logo blocking center data modules" });
  }

  // --- 5. Error Correction Level ---
  if (ecl === "H") {
    checks.push({ status: "pass", message: "High error correction (recovers up to 30% damage)" });
  } else if (ecl === "Q") {
    checks.push({ status: "pass", message: "Good error correction (recovers up to 25% damage)" });
  } else if (ecl === "M") {
    checks.push({ status: "pass", message: "Standard error correction (recovers up to 15% damage)" });
    if (logoSize > 0.25) score -= 5;
  } else {
    checks.push({ status: "warn", message: "Low error correction (7% recovery) — vulnerable to scratches" });
    score -= 10;
  }

  // --- 6. Gradient Check ---
  if (options.dotsOptions?.gradient) {
    checks.push({ status: "warn", message: "Color gradient slightly reduces dot edge sharpness" });
    score -= 8;
  } else {
    checks.push({ status: "pass", message: "Solid dot colors for maximum edge clarity" });
  }

  // --- 7. Quiet Zone (Margin) Check ---
  const margin = options.margin ?? 10;
  if (margin >= 10) {
    checks.push({ status: "pass", message: "Good quiet zone margin for clean edge detection" });
  } else if (margin >= 5) {
    checks.push({ status: "warn", message: "Quiet zone could be larger for small prints" });
    score -= 5;
  } else {
    checks.push({ status: "fail", message: "Insufficient quiet zone margin around QR code" });
    score -= 15;
  }

  return { score: Math.max(0, Math.min(100, score)), checks };
}

function hexToRgb(hex) {
  if (!hex || typeof hex !== "string") return { r: 0, g: 0, b: 0 };
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  return {
    r: parseInt(h.substring(0, 2), 16) || 0,
    g: parseInt(h.substring(2, 4), 16) || 0,
    b: parseInt(h.substring(4, 6), 16) || 0,
  };
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  try {
    const l1 = relativeLuminance(hexToRgb(hex1));
    const l2 = relativeLuminance(hexToRgb(hex2));
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 21;
  }
}
