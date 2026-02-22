import crypto from "crypto";
import { AuthenticationError } from "./errors";

const ADMIN_COOKIE_NAME = "zenbox_admin_token";
const ADMIN_TOKEN_EXPIRES_SECONDS = 7 * 24 * 60 * 60;

const getJwtSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is required");
  }
  return secret;
};

export interface AdminJwtPayload {
  id: string;
  email: string;
  name?: string | null;
  exp: number;
  iat: number;
}

interface SignAdminTokenInput {
  id: string;
  email: string;
  name?: string | null;
}

export const signAdminToken = (payload: SignAdminTokenInput) => {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: AdminJwtPayload = {
    ...payload,
    iat: now,
    exp: now + ADMIN_TOKEN_EXPIRES_SECONDS,
  };

  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
};

export const verifyAdminToken = (token: string) => {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) {
      throw new Error("Invalid token shape");
    }

    const expectedSignature = crypto
      .createHmac("sha256", getJwtSecret())
      .update(encodedPayload)
      .digest("base64url");

    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (
      actualBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
      throw new Error("Invalid token signature");
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as AdminJwtPayload;

    if (!payload.exp || Math.floor(Date.now() / 1000) > payload.exp) {
      throw new Error("Token expired");
    }

    return payload;
  } catch {
    throw new AuthenticationError("Admin authentication failed");
  }
};

export const adminCookieName = ADMIN_COOKIE_NAME;
