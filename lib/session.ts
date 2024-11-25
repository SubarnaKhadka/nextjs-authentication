import "server-only";

import * as jose from "jose";

import { JWTPayload, SignJWT } from "jose";
import {
  ACCESS_EXPIRATION_TIME,
  ACCESS_SECRET,
  AUTH_SECRET,
  AUTH_SESSION_TOKEN_NAME,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_SUBJECT,
  REFRESH_EXPIRATION_TIME,
  REFRESH_SECRET,
} from "./constants";
import { users } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { seconds } from "./utils";
import { cookies } from "next/headers";
import { unstable_cache as cache } from "next/cache";
import { redirect } from "next/navigation";

type SignJWTOptions = {
  expiresIn: string;
  secret: string;
};

export async function jwtSignIn(payload: JWTPayload, options: SignJWTOptions) {
  const { expiresIn, secret } = options;

  const encodedKey = new TextEncoder().encode(secret);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(JWT_ISSUER)
    .setSubject(JWT_SUBJECT)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey);
}

export async function decrypt(
  token: string,
  secret: string
): Promise<jose.JWTPayload | null> {
  const encodedKey = new TextEncoder().encode(secret);

  try {
    const { payload } = await jose.jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
     return null;
  }
}

export async function getToken(user: Partial<InferSelectModel<typeof users>>) {
  if (user?.deletedAt) {
    throw new Error("User is not active");
  }

  const accessToken = await jwtSignIn(
    { id: user.id },
    {
      secret: ACCESS_SECRET,
      expiresIn: ACCESS_EXPIRATION_TIME,
    }
  );

  const refreshToken = await jwtSignIn(
    { id: user.id, loginDate: new Date() },
    {
      secret: REFRESH_SECRET,
      expiresIn: REFRESH_EXPIRATION_TIME,
    }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: seconds(ACCESS_EXPIRATION_TIME),
  };
}

export const getAccessToken = async () => {
  const authToken = (await cookies()).get(AUTH_SESSION_TOKEN_NAME)?.value;

  if (!authToken) redirect("/auth/login");

  return cache(async (authToken: string) => {
    const jwkKey = await jose.importJWK({
      kty: "oct",
      k: AUTH_SECRET,
    });

    const decoded = await jose.jwtDecrypt(authToken, jwkKey);

    return decoded?.payload?.accessToken || undefined;
  })(authToken);
};

export async function encryptJWT(payload: { accessToken: string }) {
  const jwkKey = await jose.importJWK({
    kty: "oct",
    k: AUTH_SECRET,
  });

  const encodedToken = await new jose.EncryptJWT({
    accessToken: payload.accessToken,
  })
    .setProtectedHeader({
      alg: "dir",
      enc: "A256GCM",
    })
    .encrypt(jwkKey);

  return encodedToken;
}

export const decryptAccessToken = (token: string) => {
  return decrypt(token, ACCESS_SECRET);
};

export const decryptRefreshToken = (token: string) => {
  return decrypt(token, REFRESH_SECRET);
};
