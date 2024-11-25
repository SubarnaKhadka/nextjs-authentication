/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/db/drizzle";
import { passwordResetToken } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const result = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, token))
      .limit(1);
    return result[0];
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const result = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.email, email))
      .limit(1);

    return result[0];
  } catch (error) {
    return null;
  }
};

export const removePasswordResetToken = async (id: string) => {
  return await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.id, id));
};

export const addPasswordResetToken = async (
  email: string,
  token: string,
  expires: Date
) => {
  const [insertedValue] = await db
    .insert(passwordResetToken)
    .values({ email, token, expires })
    .returning();
  return insertedValue;
};
