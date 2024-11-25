export const AUTH_SESSION_TOKEN_NAME = 'nextjs.session-token';

/**
 * The default redirect path after logging in.
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/";

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged-in users to the homepage.
 */
export const authRoutes: string[] = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/forgot-password",
    "/auth/check-email",
    "/auth/verify",
    "/auth/reset-password",
];