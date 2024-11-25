"use server";

import { verifyToken } from "@/services/auth.service";

export const verifyTokenAction = async (token: string) => {
  try {
    await verifyToken(token);
    return { status: 200, message: "Email verified!" };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 400, message: err?.message };
    }
    return { status: 400, message: "unknown error" };
  }
};
