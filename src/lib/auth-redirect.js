export function getSafeNext(value, fallback = "/dashboard") {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")) {
    return value;
  }
  return fallback;
}