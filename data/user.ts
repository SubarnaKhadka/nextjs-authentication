/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0];
  } catch (err) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0];
  } catch (e) {
    return null;
  }
};

interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (payload: IRegisterPayload) => {
  return await db.insert(users).values(payload);
};

export const updateEmailVerified = async (
  id: string,
  emailVerified: Date | null
) => {
  return await db
    .update(users)
    .set({ emailVerified: emailVerified })
    .where(eq(users.id, id));
};

export const updatePassword = async (id: string, hashedPassword: string) => {
  return await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, id));
};
