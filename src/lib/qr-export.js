/**
 * QR Export — shared layout + rendering helpers for export.
 *
 * The export FRAME is the source of truth. The QR is centered and sized to a
 * configurable coverage of the frame (default 85%), independent of the preview
 * DOM. This module is format-agnostic so PNG / JPG / WebP / SVG / PDF all use
 * the exact same layout calculation.
 *
 * Hierarchy:
 *   EXPORT FRAME (canvasWidth x canvasHeight)
 *     ├── ~7.5% outer margin (implicit via coverage)
 *     └── QR AREA (qrSize x qrSize, centered at x/y)
 *           ├── QR modules / eyes / dots
 *           └── required quiet zone (kept intact — never cropped)
 */

export const QR_EXPORT_COVERAGE = 0.85;

/**
 * Compute the QR render layout inside an export frame.
 *
 * @param {number} canvasWidth  - actual export width in px
 * @param {number} canvasHeight - actual export height in px
 * @param {number} coverage     - QR footprint as a fraction of the smaller
 *                                dimension (0..1). Defaults to 85%.
 * @returns {{ qrSize: number, x: number, y: number }}
 */
export function calculateQRExportLayout({
  canvasWidth,
  canvasHeight,
  coverage = QR_EXPORT_COVERAGE,
}) {
  const qrSize = Math.min(canvasWidth, canvasHeight) * coverage;
  const x = (canvasWidth - qrSize) / 2;
  const y = (canvasHeight - qrSize) / 2;
  // Round to whole pixels so all export formats agree.
  return {
    qrSize: Math.round(qrSize),
    x: Math.round(x),
    y: Math.round(y),
  };
}

/**
 * Build a white-background framed SVG with the QR image centered at 85%.
 * Used for direct SVG export and as the rasterization source for canvas export.
 *
 * @param {string} qrSvgString - the QR's own SVG markup (from qr-code-styling).
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} [coverage]
 * @returns {string} full framed SVG document string.
 */
export function buildFramedSvg({
  qrSvgString,
  canvasWidth,
  canvasHeight,
  coverage = QR_EXPORT_COVERAGE,
}) {
  const { qrSize, x, y } = calculateQRExportLayout({
    canvasWidth,
    canvasHeight,
    coverage,
  });

  // Normalize the QR SVG: drop DTD/prolog, force a clean root with an explicit
  // size so it renders deterministically when placed inside the frame.
  const normalizedQr = qrSvgString
    .replace(/^<\?xml[^>]*\?>/i, "")
    .replace(/^<!DOCTYPE[^>]*>/i, "")
    .replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"')
    .replace(/width="[^"]*"/i, `width="${qrSize}"`)
    .replace(/height="[^"]*"/i, `height="${qrSize}"`);

  const encodedQr = toDataUri(normalizedQr, "image/svg+xml");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
  <rect x="0" y="0" width="${canvasWidth}" height="${canvasHeight}" fill="#ffffff"/>
  <image x="${x}" y="${y}" width="${qrSize}" height="${qrSize}" preserveAspectRatio="xMidYMid meet" xlink:href="${encodedQr}"/>
</svg>`;
}

/**
 * Rasterize a framed SVG onto an HTML canvas at the export resolution.
 *
 * @param {string} framedSvg
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @returns {Promise<HTMLCanvasElement>}
 */
export function rasterizeSvgToCanvas(framedSvg, canvasWidth, canvasHeight) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas 2D context unavailable"));
      return;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const img = new Image();
    img.onload = () => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error("Failed to rasterize QR image"));
    img.src = toDataUri(framedSvg, "image/svg+xml");
  });
}

/**
 * Trigger a browser download for a Blob/String payload.
 * @param {Blob|string} payload
 * @param {string} mime
 * @param {string} filename
 */
export function triggerDownload(payload, mime, filename) {
  const blob = payload instanceof Blob ? payload : new Blob([payload], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Convert a raw string to a base64 data URI (UTF-8 safe).
 */
function toDataUri(str, mime) {
  return `data:${mime};base64,${btoa(unescape(encodeURIComponent(str)))}`;
}
