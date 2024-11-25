import {
  getPasswordResetTokenByToken,
  removePasswordResetToken,
} from "@/data/password-resets";
import { getUserByEmail, updatePassword } from "@/data/user";
import { ResetPasswordSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { values, token } = body;

  if (!token) {
    return NextResponse.json({ message: "Missing token!" }, { status: 400 });
  }

  try {
    const validation = ResetPasswordSchema.parse(values);
    const { password } = validation;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return NextResponse.json({ message: "Invalid token!" }, { status: 400 });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return NextResponse.json(
        { message: "Token has expired!" },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return { error: "Email does not exist!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await updatePassword(existingUser.id, hashedPassword);

    await removePasswordResetToken(existingToken.id);

    return NextResponse.json({ message: "Password updated!" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
