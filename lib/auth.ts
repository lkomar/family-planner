import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/** Name of the signed session cookie set once the household password is entered. */
export const SESSION_COOKIE_NAME = "fp_session";

/** How long a successful unlock lasts before the password is required again. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Generate one (e.g. `openssl rand -hex 32`) and set it as an environment variable.",
    );
  }
  return secret;
}

/**
 * Constant-time string comparison. Hashing both sides first means the
 * comparison is always over fixed-length digests, so a tampered value of a
 * different length can't be distinguished by timing either.
 */
function safeEqual(a: string, b: string): boolean {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

function sign(payload: string): string {
  return createHmac("sha256", getAuthSecret())
    .update(payload)
    .digest("base64url");
}

/** Checks a candidate password against SITE_PASSWORD. */
export function verifySitePassword(candidate: string): boolean {
  const expected = process.env.SITE_PASSWORD;
  if (!expected) {
    throw new Error("SITE_PASSWORD is not set — see .env.example.");
  }
  return safeEqual(candidate, expected);
}

/** Issues a signed, expiring session token to store in the session cookie. */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

/** Verifies a session token's signature and expiry. No database lookup involved. */
export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}
