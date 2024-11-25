"use server";

import { z } from "zod";

import { RegisterSchema } from "@/schemas";
import { register } from "@/services/auth.service";

export const registerAction = async (
  values: z.infer<typeof RegisterSchema>
) => {
  try {
    await register(values);
    return { status: 200, message: "Register successfully" };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 400, message: err?.message };
    }
    return { status: 400, message: "unknown error" };
  }
};
