import { toBase64 } from "./hasher";

/**
 * Make a normalized API user id string in the same format your legacy services expect.
 * - If the backend already returned a base64 string (e.g. "MQ==" or "MQ"), we strip padding and return "MQ"
 * - If login returned a plain numeric id (e.g. "1"), we base64-encode it and strip padding ("MQ")
 */
export function normalizeApiUserId(raw: string | undefined | null): string {
  if (!raw) return "";
  // if it already looks like base64 (contains non-digits), just strip padding
  const looksBase64 = /[^0-9]/.test(raw);
  if (looksBase64) {
    return raw.replace(/=+$/, "");
  }
  // otherwise raw looks numeric -> base64 encode then strip padding
  return toBase64(String(raw)).replace(/=+$/, "");
}
