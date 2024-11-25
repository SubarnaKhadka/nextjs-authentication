import { db } from "@/db/drizzle";
import { twoFactorToken } from "@/db/schema";
import { eq } from "drizzle-orm";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const result = await db
      .select()
      .from(twoFactorToken)
      .where(eq(twoFactorToken.token, token))
      .limit(1);
    return result[0];
  } catch (err) {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const result = await db
      .select()
      .from(twoFactorToken)
      .where(eq(twoFactorToken.email, email))
      .limit(1);
    return result[0];
  } catch (err) {
    return null;
  }
};

export const removeTwoFactorToken = async (id: string) => {
  return await db.delete(twoFactorToken).where(eq(twoFactorToken.id, id));
};

export const addTwoFactorToken = async (
  email: string,
  token: string,
  expires: Date
) => {
  const [insertedValue] = await db
    .insert(twoFactorToken)
    .values({ email, token, expires })
    .returning();

    return insertedValue;
};
