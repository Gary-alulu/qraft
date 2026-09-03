/**
 * QR Data Builders
 * Convert form data into QR-compatible strings for each content type.
 */

export function buildWebsiteString(url) {
  return url || "";
}

export function buildTextString(text) {
  return text || "";
}

export function buildWiFiString({ ssid, password, security = "WPA", hidden = false }) {
  return `WIFI:S:${ssid || ""};T:${security};P:${password || ""};H:${hidden ? "true" : "false"};;`;
}

export function buildVCardString({
  firstName = "",
  lastName = "",
  phone = "",
  email = "",
  website = "",
  company = "",
  title = "",
  address = "",
}) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName}`,
    `FN:${firstName} ${lastName}`.trim(),
    title ? `TITLE:${title}` : "",
    company ? `ORG:${company}` : "",
    phone ? `TEL:${phone}` : "",
    email ? `EMAIL:${email}` : "",
    website ? `URL:${website}` : "",
    address ? `ADR:;;${address}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildEmailString({ to = "", subject = "", body = "" }) {
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${to}${params.length ? "?" + params.join("&") : ""}`;
}

export function buildSMSString({ phone = "", message = "" }) {
  return `smsto:${phone}:${message}`;
}

export function buildPhoneString(phone) {
  return `tel:${phone || ""}`;
}

export function buildEventString({
  title = "",
  description = "",
  location = "",
  start = "",
  end = "",
  organizer = "",
  url = "",
}) {
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }
  return [
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description}` : "",
    location ? `LOCATION:${location}` : "",
    start ? `DTSTART:${formatDate(start)}` : "",
    end ? `DTEND:${formatDate(end)}` : "",
    organizer ? `ORGANIZER:${organizer}` : "",
    url ? `URL:${url}` : "",
    "END:VEVENT",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildLocationString({ lat, lng }) {
  return `geo:${lat || 0},${lng || 0}`;
}

export function buildWhatsAppString({ phone = "", message = "" }) {
  const base = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Build the full URL string for a document upload.
 * The `url` field is an absolute or relative path to the served file
 * (e.g. `/api/files/<id>`). The QR code will encode this URL.
 */
export function buildDocumentString({ url = "" }) {
  return url || "";
}

/**
 * Get the builder function for a given QR type
 */
export const DATA_BUILDERS = {
  website: buildWebsiteString,
  text: buildTextString,
  wifi: buildWiFiString,
  vcard: buildVCardString,
  email: buildEmailString,
  sms: buildSMSString,
  phone: buildPhoneString,
  event: buildEventString,
  location: buildLocationString,
  whatsapp: buildWhatsAppString,
  document: buildDocumentString,
};
