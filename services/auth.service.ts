import { api } from "@/lib/api";
import { AUTH_SESSION_TOKEN_NAME } from "@/lib/constants";
import { encryptJWT } from "@/lib/session";
import { urls } from "@/urls";
import { cookies } from "next/headers";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  values: {
    password: string;
  };
  token?: string;
}

export const register = async (data: IRegisterPayload) =>
  api.post(urls.auth.register, data, { isAuth: false });

export const verifyToken = async (token: string) =>
  api.post(urls.auth.verify, { token }, { isAuth: false });

export const login = async (data: ILoginPayload) => {
  try {
    const response = await api.post(urls.auth.login, data, { isAuth: false });

    if (response?.twoFactor) return response;

    const accessToken = response?.data?.accessToken;
    
    const decodedPayload = JSON.parse(
      Buffer.from(accessToken?.split(".")[1], "base64").toString()
    );

    if (!decodedPayload) throw new Error("Authentication failed");

    const expiresIn = Math.floor(decodedPayload?.exp / 1000);

    const encodedToken = await encryptJWT({ accessToken });

    (await cookies()).set(AUTH_SESSION_TOKEN_NAME, encodedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn,
    });
  } catch (err) {
    throw err;
  }
};

export const forgotPassword = async (data: ForgotPasswordPayload) =>
  api.post(urls.auth.forgotPassword, data, { isAuth: false });

export const resetPassword = async (data: ResetPasswordPayload) =>
  api.post(urls.auth.resetPassword, data, { isAuth: false });

export const getProfile = async () => api.get(urls.auth.profile);
