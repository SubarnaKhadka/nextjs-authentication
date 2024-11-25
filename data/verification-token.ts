import { db } from "@/db/drizzle";
import { verificationToken } from "@/db/schema";
import { eq } from "drizzle-orm";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const getVerificationTokenByToken = async (token: string) => {
  try {
    const result = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.token, token))
      .limit(1);
    return result[0];
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const result = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.email, email))
      .limit(1);
    return result[0];
  } catch (error) {
    return null;
  }
};

export const removeVerificationToken = async (id: string) => {
  await db.delete(verificationToken).where(eq(verificationToken.id, id));
};

export const addVerificationToken = async (
  email: string,
  token: string,
  expires: Date
) => {
  const [insertedRecord] = await db
    .insert(verificationToken)
    .values({
      email,
      token,
      expires,
    })
    .returning();
  return insertedRecord;
};
