import bcrypt from "bcryptjs";
import { getUserByEmail, registerUser } from "@/data/user";
import { RegisterSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { genearteVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const validation = RegisterSchema.parse(body);
    const { name, email, password } = validation;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return Response.json(
        { message: "Email already in use!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await registerUser({ name, email, password: hashedPassword });

    const verificationToken = await genearteVerificationToken(email);

    await sendVerificationEmail(email, verificationToken.token);

    return Response.json(
      { message: "Confirmation email sent!" },
      { status: 200 }
    );
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
