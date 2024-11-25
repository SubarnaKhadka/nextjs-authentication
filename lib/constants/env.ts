
export const ACCESS_SECRET = process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY!;
export const REFRESH_SECRET = process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY!;
export const ACCESS_EXPIRATION_TIME =
  process.env.ACCESS_TOKEN_EXPIRATION_TIME ?? "5h";
export const REFRESH_EXPIRATION_TIME =
  process.env.REFRESH_TOKEN_EXPIRATION_TIME ?? "14d";
export const JWT_ISSUER = process.env.AUTH_JWT_ISSUER ?? "nextjs";
export const JWT_AUDIENCE =
  process.env.AUTH_JWT_AUDIENCE ?? "http://nextjs-fullstack.com";
export const JWT_SUBJECT = process.env.AUTH_JWT_SUBJECT ?? "nextjs";
export const APP_BASE_URL = process.env.APP_BASE_URL!;
export const AUTH_SECRET = process.env.AUTH_SECRET!;
