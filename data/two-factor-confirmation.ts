/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/db/drizzle";
import { twoFactorConfirmation } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const result = await db
      .select()
      .from(twoFactorConfirmation)
      .where(eq(twoFactorConfirmation.userId, userId))
      .limit(0);
    return result[0];
  } catch (err) {
    return null;
  }
};

export const addTwoFactorConfirmation = async (userId: string) => {
  const [insertedValue] = await db
    .insert(twoFactorConfirmation)
    .values({ userId })
    .returning();
  return insertedValue;
};

export const removeTwoFactorConfirmation = async (id: string) => {
  return await db
    .delete(twoFactorConfirmation)
    .where(eq(twoFactorConfirmation.id, id));
};
