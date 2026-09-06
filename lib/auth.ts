import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

/** Name of the signed session cookie set once a household's password is entered. */
export const SESSION_COOKIE_NAME = "fp_session";

/** How long a successful unlock lasts before the password is required again. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

const SCRYPT_KEY_LENGTH = 64;

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

/**
 * Hashes a password for storage in Household.passwordHash. Format is
 * "scrypt:<salt>:<hash>" (both hex) — no external dependency, no native
 * addon, built on Node's own scrypt KDF.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

/** Checks a candidate password against a Household.passwordHash value. */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [scheme, salt, hash] = storedHash.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;

  const candidateHash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString(
    "hex",
  );
  return safeEqual(candidateHash, hash);
}

/**
 * Issues a session token bound to one tenant: a cookie valid for the
 * "smiths" household must not unlock the "joneses" household, even though
 * both use the same AUTH_SECRET.
 */
export function createSessionToken(subdomain: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${subdomain}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

/**
 * Verifies a session token's signature, expiry, and that it was issued for
 * `subdomain` specifically. No database lookup involved.
 */
export function isValidSessionToken(
  token: string | undefined,
  subdomain: string,
): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [tokenSubdomain, expiresAtRaw, signature] = parts;

  const payload = `${tokenSubdomain}.${expiresAtRaw}`;
  if (!safeEqual(signature, sign(payload))) return false;
  if (tokenSubdomain !== subdomain) return false;

  const expiresAt = Number(expiresAtRaw);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}
