/** Email pattern per product spec (avoid overly strict RFC-only rules). */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_POLICY_MESSAGE =
  "Password must be at least 8 characters long and include uppercase, lowercase, and a special symbol.";

export function isStrongPassword(value) {
  if (typeof value !== "string") return false;
  if (value.length < 8) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[^A-Za-z0-9]/.test(value)) return false;
  return true;
}
