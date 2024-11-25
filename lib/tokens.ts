import {
  addPasswordResetToken,
  getPasswordResetTokenByEmail,
  removePasswordResetToken,
} from "@/data/password-resets";
import {
  addTwoFactorToken,
  getTwoFactorTokenByEmail,
  removeTwoFactorToken,
} from "@/data/two-factor-token";
import {
  addVerificationToken,
  getVerificationTokenByEmail,
  removeVerificationToken,
} from "@/data/verification-token";
import crypto from "node:crypto";
import { v4 as uuidV4 } from "uuid";

export const genearteVerificationToken = async (email: string) => {
  const token = uuidV4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await removeVerificationToken(existingToken.id);
  }

  return await addVerificationToken(email, token, expires);
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidV4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await removePasswordResetToken(existingToken.id);
  }

  return await addPasswordResetToken(email, token, expires);
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await removeTwoFactorToken(existingToken.id);
  }

  return await addTwoFactorToken(email, token, expires);
};
