import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";
import { sanitizeNextPath } from "@/lib/auth/redirect";

type OauthStatePayload = {
  nonce: string;
  nextPath: string;
  exp: number;
};

const OAUTH_STATE_MAX_AGE_SECONDS = 60 * 10;

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getAppBaseUrl(request: NextRequest) {
  const requestOrigin = trimTrailingSlash(request.nextUrl.origin);
  const envUrl = process.env.APP_URL?.trim();
  if (envUrl) {
    try {
      const parsedEnvUrl = new URL(envUrl);
      const envOrigin = trimTrailingSlash(parsedEnvUrl.origin);
      const requestProtocol = request.nextUrl.protocol;
      const requestHostname = request.nextUrl.hostname;
      const sameHostname = parsedEnvUrl.hostname === requestHostname;
      const isProduction = process.env.NODE_ENV === "production";

      // In local/dev environments, always trust the incoming request origin.
      // This prevents accidental callback generation against production APP_URL values.
      if (!isProduction) {
        return requestOrigin;
      }

      // If host doesn't match (preview domain, www/non-www, proxy host rewrite),
      // prefer request origin so the OAuth callback URL stays consistent.
      if (!sameHostname) {
        return requestOrigin;
      }

      // Avoid breaking OAuth if APP_URL is accidentally set to http for a live https domain.
      if (
        requestProtocol === "https:" &&
        parsedEnvUrl.protocol === "http:" &&
        sameHostname
      ) {
        return requestOrigin;
      }

      return envOrigin;
    } catch {
      return requestOrigin;
    }
  }

  return requestOrigin;
}

export function getGoogleRedirectUri(request: NextRequest) {
  return `${getAppBaseUrl(request)}/api/auth/google/callback`;
}

export function getGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Google OAuth credentials.");
  }

  return { clientId, clientSecret };
}

function getOauthStateSecret() {
  const secret = process.env.GOOGLE_OAUTH_STATE_SECRET || process.env.GOOGLE_CLIENT_SECRET;

  if (!secret) {
    throw new Error("Missing OAuth state signing secret.");
  }

  return secret;
}

function toBase64Url(value: Buffer | string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url");
}

function signStatePayload(payload: string) {
  return createHmac("sha256", getOauthStateSecret()).update(payload).digest("base64url");
}

export function createOauthState(nextPath: string) {
  const payload: OauthStatePayload = {
    nonce: randomBytes(16).toString("hex"),
    nextPath: sanitizeNextPath(nextPath, "/dashboard"),
    exp: Date.now() + OAUTH_STATE_MAX_AGE_SECONDS * 1000,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signStatePayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function readOauthState(state: string): string | null {
  const [encodedPayload, providedSignature] = state.split(".");
  if (!encodedPayload || !providedSignature) return null;

  const expectedSignature = signStatePayload(encodedPayload);
  const providedBuffer = fromBase64Url(providedSignature);
  const expectedBuffer = fromBase64Url(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  let payload: OauthStatePayload;
  try {
    payload = JSON.parse(fromBase64Url(encodedPayload).toString("utf8")) as OauthStatePayload;
  } catch {
    return null;
  }

  if (payload.exp <= Date.now()) {
    return null;
  }

  return sanitizeNextPath(payload.nextPath, "/dashboard");
}
