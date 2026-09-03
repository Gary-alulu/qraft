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
 * Analyze QR scanability based on design choices
 * Returns a score 0-100 and list of checks
 */
export function analyzeScanability(options) {
  const checks = [];
  let score = 100;

  // Check 1: Contrast
  const fgColor = options.dotsOptions?.color || "#000000";
  const bgColor = options.backgroundOptions?.color || "#FFFFFF";
  const contrastRatio = getContrastRatio(fgColor, bgColor);

  if (contrastRatio >= 7) {
    checks.push({ status: "pass", message: "Excellent contrast ratio" });
  } else if (contrastRatio >= 4.5) {
    checks.push({ status: "pass", message: "Good contrast ratio" });
    score -= 5;
  } else if (contrastRatio >= 3) {
    checks.push({ status: "warn", message: "Low contrast may affect scanning" });
    score -= 15;
  } else {
    checks.push({ status: "fail", message: "Contrast too low for reliable scanning" });
    score -= 30;
  }

  // Check 2: Logo size
  const logoSize = options.imageOptions?.imageSize || 0;
  if (logoSize === 0) {
    checks.push({ status: "pass", message: "No logo blocking data" });
  } else if (logoSize <= 0.3) {
    checks.push({ status: "pass", message: "Logo size acceptable" });
  } else if (logoSize <= 0.4) {
    checks.push({ status: "warn", message: "Logo slightly large" });
    score -= 10;
  } else {
    checks.push({ status: "fail", message: "Logo too large — may block data" });
    score -= 25;
  }

  // Check 3: Error correction
  const ecl = options.qrOptions?.errorCorrectionLevel || "M";
  if (ecl === "H") {
    checks.push({ status: "pass", message: "High error correction" });
  } else if (ecl === "Q") {
    checks.push({ status: "pass", message: "Good error correction" });
  } else if (ecl === "M") {
    checks.push({ status: "pass", message: "Standard error correction" });
    if (logoSize > 0.2) score -= 5;
  } else {
    checks.push({ status: "warn", message: "Low error correction" });
    score -= 10;
  }

  // Check 4: Gradient
  if (options.dotsOptions?.gradient) {
    checks.push({ status: "warn", message: "Gradient slightly reduces contrast" });
    score -= 8;
  } else {
    checks.push({ status: "pass", message: "Solid colors for best reliability" });
  }

  // Check 5: Quiet zone
  const margin = options.margin ?? 10;
  if (margin >= 10) {
    checks.push({ status: "pass", message: "Good quiet zone" });
  } else if (margin >= 5) {
    checks.push({ status: "warn", message: "Quiet zone could be larger" });
    score -= 5;
  } else {
    checks.push({ status: "fail", message: "Insufficient quiet zone" });
    score -= 15;
  }

  return { score: Math.max(0, Math.min(100, score)), checks };
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
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
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
