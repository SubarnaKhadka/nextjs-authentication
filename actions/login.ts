"use server";

import { z } from "zod";

import { LoginSchema } from "@/schemas";
import { login } from "@/services/auth.service";

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const response = await login(values);

    if (response?.twoFactor) {
      return {
        status: 200,
        message: "Two factor token sent!",
        twoFactor: true,
      };
    }

    return { status: 200, message: "Login successfully" };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 400, message: err?.message };
    }
    return { status: 400, message: "unknown error" };
  }
};
