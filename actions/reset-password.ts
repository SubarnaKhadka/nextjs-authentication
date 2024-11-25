"use server";
import * as z from "zod";
import { ForgotPasswordSchema, ResetPasswordSchema } from "../schemas";
import { forgotPassword, resetPassword } from "@/services/auth.service";

export const sendResetPasswordLinkAction = async (
  values: z.infer<typeof ForgotPasswordSchema>
) => {
  try {
    await forgotPassword(values);
    return { status: 200, message: "Reset email sent!" };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 400, message: err?.message };
    }
    return { status: 400, message: "unknown error" };
  }
};

export const resetPasswordAction = async (
  values: z.infer<typeof ResetPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { status: 400, message: "missing token" };
  }

  try {
    await resetPassword({ values, token });
      return { status: 200, message: "Password updated!" };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 400, message: err?.message };
    }
    return { status: 400, message: "unknown error" };
  }
};
